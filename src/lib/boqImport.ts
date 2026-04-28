import type { BOQProject, EngravingProject, EngravingRoom, Keypad, ButtonCount } from '../types';
import { generateId, createDefaultButtons, DEFAULT_SETTINGS } from './defaults';

const KEYPAD_KEYS = ['frontend.keypad-8btn', 'frontend.keypad-4btn', 'frontend.keypad-2btn', 'frontend.keypad-6btn'];
const KEYPAD_WORDS = ['keypad', 'key pad', 'push button', 'button plate'];

function detectButtonCount(product: string, canonicalKey?: string): ButtonCount {
  if (canonicalKey === 'frontend.keypad-8btn') return 8;
  if (canonicalKey === 'frontend.keypad-4btn') return 4;
  if (canonicalKey === 'frontend.keypad-6btn') return 6;
  if (canonicalKey === 'frontend.keypad-2btn') return 2;
  if (/8.?button|8.?btn/i.test(product)) return 8;
  if (/6.?button|6.?btn/i.test(product)) return 6;
  if (/4.?button|4.?btn/i.test(product)) return 4;
  if (/2.?button|2.?btn/i.test(product)) return 2;
  return 4;
}

function isKeypadItem(item: BOQProject['lineItems'][0]): boolean {
  if (item.canonicalKey && KEYPAD_KEYS.includes(item.canonicalKey)) return true;
  const text = `${item.product} ${item.scope}`.toLowerCase();
  return KEYPAD_WORDS.some(w => text.includes(w));
}

export function importFromBOQ(boq: BOQProject): EngravingProject {
  const now = new Date().toISOString();
  const keypadItems = boq.lineItems.filter(i => i.included && isKeypadItem(i));

  const rooms: EngravingRoom[] = boq.rooms.map((r, idx) => {
    const keypads: Keypad[] = keypadItems
      .filter(item => item.roomAllocations.some(a => a.roomId === r.id && a.qty > 0))
      .flatMap(item =>
        item.roomAllocations
          .filter(a => a.roomId === r.id && a.qty > 0)
          .map(a => ({
            id: generateId(),
            name: item.product,
            location: '',
            buttonCount: detectButtonCount(item.product, item.canonicalKey),
            brand: item.brand || '',
            model: item.modelNumber || '',
            finish: '',
            quantity: a.qty,
            notes: item.notes || '',
            buttons: createDefaultButtons(detectButtonCount(item.product, item.canonicalKey)),
          }))
      );

    return {
      id: generateId(),
      name: r.name,
      type: 'Other' as const,
      notes: '',
      order: idx,
      keypads,
    };
  });

  return {
    id: generateId(),
    name: boq.name,
    client: boq.client,
    projectCode: boq.projectCode,
    preparedBy: '',
    date: now.slice(0, 10),
    revision: 1,
    globalNotes: 'All keypads color Chime Brown & Printing White Color',
    settings: { ...DEFAULT_SETTINGS },
    rooms,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    boqProjectId: boq.id,
  };
}
