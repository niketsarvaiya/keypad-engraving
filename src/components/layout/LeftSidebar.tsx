import { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, Layers, LayoutGrid, Trash2, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useStore } from '../../store/useStore';
import { RoomFormModal } from '../features/RoomFormModal';
import { KeypadFormModal } from '../features/KeypadFormModal';

interface Props {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function LeftSidebar({ mobileOpen, onMobileClose }: Props) {
  const { activeProject, activeProjectId, activeRoomId, activeKeypadId, setActiveRoom, setActiveKeypad, removeRoom, removeKeypad } = useStore();
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
    onMobileClose?.();
  };

  const handleSelectKeypad = (roomId: string, keypadId: string) => {
    setActiveRoom(roomId);
    setActiveKeypad(keypadId);
    onMobileClose?.();
  };

  const sidebarContent = (
    <div className="w-[228px] min-w-[228px] flex flex-col h-full bg-panel border-r border-line">
      {/* Header */}
      <div className="px-4 py-3 border-b border-line flex items-center justify-between">
        <span className="text-[11px] font-semibold text-ink-3 uppercase tracking-[0.06em]">Rooms & Keypads</span>
        <button
          onClick={() => setShowRoomModal(true)}
          className="icon-btn w-6 h-6 rounded-md"
          title="Add Room"
        >
          <Plus size={13} />
        </button>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto scrollbar-thin py-1.5">
        {project.rooms.length === 0 && (
          <div className="px-4 py-8 text-center">
            <Layers size={20} className="text-ink-3 mx-auto mb-2" />
            <p className="text-[12px] text-ink-3 mb-2">No rooms yet.</p>
            <button onClick={() => setShowRoomModal(true)} className="text-[12px] text-accent hover:opacity-70 font-medium transition-opacity">
              Add first room
            </button>
          </div>
        )}

        {project.rooms.map(room => (
          <div key={room.id}>
            {/* Room row */}
            <div className={clsx(
              'group flex items-center gap-1.5 px-3 py-2 cursor-pointer mx-1.5 rounded-lg transition-colors',
              activeRoomId === room.id && activeKeypadId === null
                ? 'bg-accent-dim text-accent'
                : 'text-ink-2 hover:bg-raised hover:text-ink',
            )}>
              <button className="shrink-0 p-0.5 transition-transform" onClick={() => toggleRoom(room.id)}>
                {expandedRooms.has(room.id) ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
              </button>
              <Layers size={12} className="shrink-0 opacity-60" />
              <span className="flex-1 text-[13px] font-medium truncate" onClick={() => handleSelectRoom(room.id)}>
                {room.name}
              </span>
              <span className="text-[10px] text-ink-3 shrink-0 tabular-nums">{room.keypads.length}</span>
              <button
                onClick={e => { e.stopPropagation(); removeRoom(activeProjectId, room.id); }}
                className="opacity-0 group-hover:opacity-100 icon-btn w-5 h-5 rounded hover:bg-[rgba(239,68,68,0.1)] hover:text-[#ef4444]"
                title="Delete room"
              >
                <Trash2 size={10} />
              </button>
            </div>

            {/* Keypads */}
            {expandedRooms.has(room.id) && (
              <div className="ml-5 mb-1">
                {room.keypads.map(kp => (
                  <div
                    key={kp.id}
                    onClick={() => handleSelectKeypad(room.id, kp.id)}
                    className={clsx(
                      'group flex items-center gap-1.5 px-3 py-1.5 cursor-pointer mx-1.5 rounded-lg transition-colors',
                      activeKeypadId === kp.id
                        ? 'bg-accent-dim text-accent'
                        : 'text-ink-3 hover:bg-raised hover:text-ink-2',
                    )}
                  >
                    <LayoutGrid size={11} className="shrink-0 opacity-70" />
                    <span className="flex-1 text-[12px] truncate">{kp.name || kp.location || 'Keypad'}</span>
                    <span className="text-[10px] text-ink-3 shrink-0 tabular-nums">{kp.buttonCount}B</span>
                    <button
                      onClick={e => { e.stopPropagation(); removeKeypad(activeProjectId, room.id, kp.id); }}
                      className="opacity-0 group-hover:opacity-100 icon-btn w-5 h-5 rounded hover:bg-[rgba(239,68,68,0.1)] hover:text-[#ef4444]"
                      title="Delete keypad"
                    >
                      <Trash2 size={9} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setShowKeypadModal(room.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 w-full text-[11px] text-ink-3 hover:text-accent transition-colors mx-1.5"
                >
                  <Plus size={10} />Add keypad
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-line">
        <p className="text-[11px] text-ink-3">
          {project.rooms.length} rooms · {project.rooms.reduce((a, r) => a + r.keypads.length, 0)} keypads
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:flex h-full">{sidebarContent}</div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onMobileClose} />
          <div className="relative z-10 flex h-full">
            {sidebarContent}
            <button
              onClick={onMobileClose}
              className="absolute top-3 right-3 icon-btn bg-surface"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <RoomFormModal projectId={activeProjectId} open={showRoomModal} onClose={() => setShowRoomModal(false)} />
      {showKeypadModal && (
        <KeypadFormModal projectId={activeProjectId} roomId={showKeypadModal} open={true} onClose={() => setShowKeypadModal(null)} />
      )}
    </>
  );
}
