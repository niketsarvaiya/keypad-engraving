import { Layers, LayoutGrid, BookOpen, Palette } from 'lucide-react';
import type { MobilePanel } from '../../types';

interface Props { active: MobilePanel; onChange: (p: MobilePanel) => void; }

const TABS: { id: MobilePanel; icon: typeof Layers; label: string }[] = [
  { id: 'rooms',      icon: Layers,     label: 'Rooms' },
  { id: 'editor',     icon: LayoutGrid, label: 'Editor' },
  { id: 'library',    icon: BookOpen,   label: 'Library' },
  { id: 'properties', icon: Palette,    label: 'Finish' },
];

export function MobileBottomNav({ active, onChange }: Props) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-line flex no-print"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {TABS.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={[
            'flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors',
            active === t.id ? 'text-accent' : 'text-ink-3 hover:text-ink-2',
          ].join(' ')}
        >
          <t.icon size={18} strokeWidth={active === t.id ? 2.5 : 1.8} />
          <span className="text-[10px] font-medium">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
