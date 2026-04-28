import { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, Layers, LayoutGrid, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useStore } from '../../store/useStore';
import { RoomFormModal } from '../features/RoomFormModal';
import { KeypadFormModal } from '../features/KeypadFormModal';

export function LeftSidebar() {
  const {
    activeProject, activeProjectId, activeRoomId, activeKeypadId,
    setActiveRoom, setActiveKeypad, removeRoom, removeKeypad,
  } = useStore();

  const project = activeProject();
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(
    () => new Set(project?.rooms.map(r => r.id) ?? [])
  );
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showKeypadModal, setShowKeypadModal] = useState<string | null>(null);

  if (!project || !activeProjectId) return null;

  const toggleRoom = (id: string) =>
    setExpandedRooms(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleSelectRoom = (roomId: string) => {
    setActiveRoom(roomId);
    const room = project.rooms.find(r => r.id === roomId);
    if (room?.keypads[0]) setActiveKeypad(room.keypads[0].id);
  };

  return (
    <>
      <div className="w-[240px] min-w-[240px] flex flex-col h-full bg-[#0f1117] border-r border-[rgba(255,255,255,0.06)]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
          <span className="label mb-0">Rooms & Keypads</span>
          <button
            onClick={() => setShowRoomModal(true)}
            className="p-1 rounded hover:bg-[rgba(255,255,255,0.06)] text-[#565a72] hover:text-[#6366f1] transition-colors"
            title="Add Room"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Tree */}
        <div className="flex-1 overflow-y-auto scrollbar-thin py-2">
          {project.rooms.length === 0 && (
            <div className="px-4 py-6 text-center">
              <Layers size={24} className="text-[#565a72] mx-auto mb-2" />
              <p className="text-[12px] text-[#565a72]">No rooms yet.</p>
              <button
                onClick={() => setShowRoomModal(true)}
                className="mt-2 text-[12px] text-[#6366f1] hover:underline"
              >
                Add first room
              </button>
            </div>
          )}

          {project.rooms.map(room => (
            <div key={room.id}>
              {/* Room row */}
              <div
                className={clsx(
                  'group flex items-center gap-1.5 px-3 py-2 cursor-pointer',
                  activeRoomId === room.id && activeKeypadId === null
                    ? 'bg-[rgba(99,102,241,0.1)] text-[#6366f1]'
                    : 'hover:bg-[rgba(255,255,255,0.04)] text-[#8b8fa8] hover:text-[#f0f1f3]',
                )}
              >
                <button
                  className="shrink-0 p-0.5"
                  onClick={() => toggleRoom(room.id)}
                >
                  {expandedRooms.has(room.id)
                    ? <ChevronDown size={12} />
                    : <ChevronRight size={12} />}
                </button>
                <Layers size={13} className="shrink-0" />
                <span
                  className="flex-1 text-[13px] font-medium truncate"
                  onClick={() => handleSelectRoom(room.id)}
                >
                  {room.name}
                </span>
                <span className="text-[11px] text-[#565a72] shrink-0">
                  {room.keypads.length}
                </span>
                <button
                  onClick={e => { e.stopPropagation(); removeRoom(activeProjectId, room.id); }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-[#ef4444] transition-all"
                  title="Delete room"
                >
                  <Trash2 size={11} />
                </button>
              </div>

              {/* Keypads */}
              {expandedRooms.has(room.id) && (
                <div className="ml-4">
                  {room.keypads.map(kp => (
                    <div
                      key={kp.id}
                      onClick={() => { setActiveRoom(room.id); setActiveKeypad(kp.id); }}
                      className={clsx(
                        'group flex items-center gap-1.5 px-3 py-1.5 cursor-pointer rounded-sm mx-1',
                        activeKeypadId === kp.id
                          ? 'bg-[rgba(99,102,241,0.12)] text-[#6366f1]'
                          : 'hover:bg-[rgba(255,255,255,0.04)] text-[#565a72] hover:text-[#8b8fa8]',
                      )}
                    >
                      <LayoutGrid size={12} className="shrink-0" />
                      <span className="flex-1 text-[12px] truncate">{kp.name || kp.location || 'Keypad'}</span>
                      <span className="text-[10px] text-[#565a72] shrink-0">{kp.buttonCount}B</span>
                      <button
                        onClick={e => { e.stopPropagation(); removeKeypad(activeProjectId, room.id, kp.id); }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-[#ef4444] transition-all"
                        title="Delete keypad"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))}

                  {/* Add keypad */}
                  <button
                    onClick={() => setShowKeypadModal(room.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 w-full text-[11px] text-[#565a72] hover:text-[#6366f1] transition-colors"
                  >
                    <Plus size={11} />
                    Add keypad
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer total */}
        <div className="px-4 py-2.5 border-t border-[rgba(255,255,255,0.06)]">
          <p className="text-[11px] text-[#565a72]">
            {project.rooms.length} rooms · {project.rooms.reduce((acc, r) => acc + r.keypads.length, 0)} keypads
          </p>
        </div>
      </div>

      <RoomFormModal
        projectId={activeProjectId}
        open={showRoomModal}
        onClose={() => setShowRoomModal(false)}
      />

      {showKeypadModal && (
        <KeypadFormModal
          projectId={activeProjectId}
          roomId={showKeypadModal}
          open={true}
          onClose={() => setShowKeypadModal(null)}
        />
      )}
    </>
  );
}
