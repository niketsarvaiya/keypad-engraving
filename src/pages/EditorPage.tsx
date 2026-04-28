import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, type DragEndEvent } from '@dnd-kit/core';
import { Plus, LayoutGrid } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { TopBar } from '../components/layout/TopBar';
import { LeftSidebar } from '../components/layout/LeftSidebar';
import { RightPanel } from '../components/features/RightPanel';
import { KeypadVisual } from '../components/features/KeypadVisual';
import { KeypadFormModal } from '../components/features/KeypadFormModal';
import type { ActionType } from '../types';

export function EditorPage() {
  const {
    activeProject, activeProjectId, activeRoomId,
    updateButton, activeRoom,
  } = useStore();

  const project = activeProject();
  const room = activeRoom();
  const [showAddKeypad, setShowAddKeypad] = useState(false);
  const [dragLabel, setDragLabel] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    setDragLabel(null);
    const { over, active } = event;
    if (!over || !active.data.current) return;

    const overId = String(over.id);
    if (!overId.startsWith('btn-')) return;

    // Parse droppable id: "btn-{buttonId}-kp-{keypadId}"
    const parts = overId.split('-kp-');
    if (parts.length < 2) return;
    const buttonId = parts[0].replace('btn-', '');
    const keypadId = parts[1];

    const { label, actionType } = active.data.current as { label: string; actionType: ActionType };

    // Find room containing this keypad
    if (!activeProjectId || !project) return;
    for (const r of project.rooms) {
      const kp = r.keypads.find(k => k.id === keypadId);
      if (kp) {
        updateButton(activeProjectId, r.id, keypadId, buttonId, { label, actionType });
        break;
      }
    }
  };

  if (!project || !activeProjectId) return null;

  const textCase = project.settings.textCase;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={e => setDragLabel(String(e.active.data.current?.label ?? ''))}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen overflow-hidden">
        <TopBar />

        <div className="flex flex-1 min-h-0">
          {/* Left sidebar */}
          <LeftSidebar />

          {/* Main editor */}
          <div className="flex-1 min-w-0 overflow-y-auto scrollbar-thin bg-[#0a0b0f] p-5">
            {!room ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <LayoutGrid size={32} className="text-[#565a72] mb-3" />
                <p className="text-[14px] text-[#565a72]">Select a room from the sidebar to start editing.</p>
              </div>
            ) : (
              <>
                {/* Room header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-[16px] font-semibold text-[#f0f1f3]">{room.name}</h2>
                    <p className="text-[12px] text-[#565a72] mt-0.5">{room.type} · {room.keypads.length} keypad{room.keypads.length !== 1 ? 's' : ''}</p>
                  </div>
                  <button
                    onClick={() => setShowAddKeypad(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.06)] text-[#8b8fa8] hover:text-[#f0f1f3] text-[12px] font-medium transition-colors"
                  >
                    <Plus size={13} />
                    Add Keypad
                  </button>
                </div>

                {room.keypads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center border border-dashed border-[rgba(255,255,255,0.08)] rounded-xl">
                    <LayoutGrid size={24} className="text-[#565a72] mb-2" />
                    <p className="text-[13px] text-[#565a72] mb-3">No keypads in this room yet.</p>
                    <button
                      onClick={() => setShowAddKeypad(true)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.2)] text-[#6366f1] text-[12px] font-medium hover:bg-[rgba(99,102,241,0.15)] transition-colors"
                    >
                      <Plus size={13} />
                      Add first keypad
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {room.keypads.map(kp => (
                      <KeypadVisual
                        key={kp.id}
                        keypad={kp}
                        textCase={textCase}
                      />
                    ))}
                  </div>
                )}

                {/* Global notes strip */}
                {project.globalNotes && (
                  <div className="mt-6 px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                    <p className="text-[11px] text-[#565a72] italic">{project.globalNotes}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right panel */}
          <RightPanel />
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {dragLabel && (
          <div className="px-3 py-1.5 rounded-lg bg-[#6366f1] text-white text-[12px] font-semibold shadow-xl pointer-events-none">
            {dragLabel}
          </div>
        )}
      </DragOverlay>

      {showAddKeypad && activeRoomId && (
        <KeypadFormModal
          projectId={activeProjectId}
          roomId={activeRoomId}
          open={true}
          onClose={() => setShowAddKeypad(false)}
        />
      )}
    </DndContext>
  );
}
