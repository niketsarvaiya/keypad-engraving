import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { clsx } from 'clsx';
import { SCENE_LIBRARY, ROOM_SUGGESTIONS } from '../../lib/defaults';
import { useStore } from '../../store/useStore';
import type { SceneCategory, SceneLibraryItem } from '../../types';

const CATEGORY_COLORS: Record<SceneCategory, string> = {
  Scenes:   'rgba(99,102,241,0.12)',
  Actions:  'rgba(239,68,68,0.1)',
  Lighting: 'rgba(245,158,11,0.1)',
};
const CATEGORY_TEXT: Record<SceneCategory, string> = {
  Scenes:   'text-[#6366f1]',
  Actions:  'text-[#ef4444]',
  Lighting: 'text-[#f59e0b]',
};

function DraggableChip({ item }: { item: SceneLibraryItem }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `scene-${item.id}`,
    data: { label: item.label, actionType: item.actionType },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={clsx(
        'px-2 py-1 rounded text-[11px] font-medium cursor-grab active:cursor-grabbing select-none',
        'border border-transparent transition-all duration-100',
        isDragging
          ? 'opacity-50 scale-95'
          : 'hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.06)]',
        CATEGORY_TEXT[item.category],
      )}
      style={{
        transform: CSS.Translate.toString(transform),
        backgroundColor: isDragging ? undefined : CATEGORY_COLORS[item.category],
      }}
    >
      {item.label}
    </div>
  );
}

export function SceneLibrary() {
  const { activeRoom } = useStore();
  const room = activeRoom();
  const suggestions = room ? (ROOM_SUGGESTIONS[room.type] ?? []) : [];

  const categories: SceneCategory[] = ['Scenes', 'Actions', 'Lighting'];

  return (
    <div className="flex flex-col gap-0 h-full overflow-y-auto scrollbar-thin">
      {/* Room suggestions */}
      {suggestions.length > 0 && (
        <div className="px-3 pt-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
          <p className="label mb-2">Suggested for {room?.type}</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map(label => {
              const item = SCENE_LIBRARY.find(s => s.label === label);
              return item
                ? <DraggableChip key={item.id} item={item} />
                : null;
            })}
          </div>
        </div>
      )}

      {/* Full library by category */}
      {categories.map(cat => {
        const items = SCENE_LIBRARY.filter(s => s.category === cat);
        return (
          <div key={cat} className="px-3 py-2.5 border-b border-[rgba(255,255,255,0.06)]">
            <p className="label mb-2">{cat}</p>
            <div className="flex flex-wrap gap-1.5">
              {items.map(item => <DraggableChip key={item.id} item={item} />)}
            </div>
          </div>
        );
      })}

      <p className="px-3 py-3 text-[11px] text-[#565a72]">
        Drag a label onto any button
      </p>
    </div>
  );
}
