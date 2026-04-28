import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { clsx } from 'clsx';
import { MousePointerClick } from 'lucide-react';
import { SCENE_LIBRARY, ROOM_SUGGESTIONS } from '../../lib/defaults';
import { useStore } from '../../store/useStore';
import type { SceneCategory, SceneLibraryItem, ActionType } from '../../types';

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

function DraggableChip({ item, onAssign }: { item: SceneLibraryItem; onAssign?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `scene-${item.id}`,
    data: { label: item.label, actionType: item.actionType },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={e => { e.stopPropagation(); onAssign?.(); }}
      className={clsx(
        'px-2 py-1 rounded text-[11px] font-medium select-none transition-all duration-100',
        'border border-transparent',
        isDragging
          ? 'opacity-40 scale-95 cursor-grabbing'
          : onAssign
            ? 'cursor-pointer hover:border-[rgba(255,255,255,0.15)] hover:scale-105 active:scale-95'
            : 'cursor-grab hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.06)]',
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
  const { activeRoom, activeButtonId, activeProjectId, activeRoomId, activeKeypadId, updateButton } = useStore();
  const room = activeRoom();
  const suggestions = room ? (ROOM_SUGGESTIONS[room.type] ?? []) : [];

  const categories: SceneCategory[] = ['Scenes', 'Actions', 'Lighting'];

  const makeAssignHandler = (item: SceneLibraryItem) => {
    if (!activeButtonId || !activeProjectId || !activeRoomId || !activeKeypadId) return undefined;
    return () => {
      updateButton(activeProjectId, activeRoomId, activeKeypadId, activeButtonId, {
        label: item.label,
        actionType: item.actionType as ActionType,
      });
    };
  };

  return (
    <div className="flex flex-col gap-0 h-full overflow-y-auto scrollbar-thin">
      {/* Click-to-assign hint */}
      {activeButtonId && (
        <div className="mx-3 mt-3 mb-1 px-2.5 py-2 rounded-lg bg-[rgba(99,102,241,0.08)] border border-[rgba(99,102,241,0.2)] flex items-center gap-2">
          <MousePointerClick size={12} className="text-[#6366f1] shrink-0" />
          <p className="text-[10px] text-[#6366f1]">Button selected — tap any chip to assign</p>
        </div>
      )}

      {/* Room suggestions */}
      {suggestions.length > 0 && (
        <div className="px-3 pt-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
          <p className="label mb-2">Suggested for {room?.type}</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map(label => {
              const item = SCENE_LIBRARY.find(s => s.label === label);
              return item
                ? <DraggableChip key={item.id} item={item} onAssign={makeAssignHandler(item)} />
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
              {items.map(item => (
                <DraggableChip key={item.id} item={item} onAssign={makeAssignHandler(item)} />
              ))}
            </div>
          </div>
        );
      })}

      <p className="px-3 py-3 text-[10px] text-[#565a72]">
        {activeButtonId ? 'Tap to assign · Drag to drop onto any button' : 'Select a button to enable tap-assign · Drag to any button'}
      </p>
    </div>
  );
}
