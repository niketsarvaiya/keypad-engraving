import { useState } from 'react';
import { Plus, ChevronDown, Layers, LayoutGrid, Trash2, X } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { RoomFormModal } from '../features/RoomFormModal';
import { KeypadFormModal } from '../features/KeypadFormModal';

interface Props {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function LeftSidebar({ mobileOpen, onMobileClose }: Props) {
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
        <motion.button
          onClick={() => setShowRoomModal(true)}
          className="icon-btn w-6 h-6 rounded-md"
          title="Add Room"
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 400, damping: 16 }}
        >
          <Plus size={13} />
        </motion.button>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto scrollbar-thin py-1.5">
        {project.rooms.length === 0 && (
          <motion.div
            className="px-4 py-8 text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Layers size={20} className="text-ink-3 mx-auto mb-2" />
            <p className="text-[12px] text-ink-3 mb-2">No rooms yet.</p>
            <button onClick={() => setShowRoomModal(true)} className="text-[12px] text-accent hover:opacity-70 font-medium transition-opacity">
              Add first room
            </button>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {project.rooms.map((room, ri) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8, transition: { duration: 0.18 } }}
              transition={{ delay: ri * 0.04, duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Room row */}
              <div className={clsx(
                'group flex items-center gap-1.5 px-3 py-2 cursor-pointer mx-1.5 rounded-lg transition-colors',
                activeRoomId === room.id && activeKeypadId === null
                  ? 'bg-accent-dim text-accent'
                  : 'text-ink-2 hover:bg-raised hover:text-ink',
              )}>
                <motion.button
                  className="shrink-0 p-0.5"
                  onClick={() => toggleRoom(room.id)}
                  animate={{ rotate: expandedRooms.has(room.id) ? 0 : -90 }}
                  transition={{ duration: 0.18, ease: 'easeInOut' }}
                >
                  <ChevronDown size={11} />
                </motion.button>
                <Layers size={12} className="shrink-0 opacity-60" />
                <span
                  className="flex-1 text-[13px] font-medium truncate"
                  onClick={() => handleSelectRoom(room.id)}
                >
                  {room.name}
                </span>
                <span className="text-[10px] text-ink-3 shrink-0 tabular-nums">{room.keypads.length}</span>
                <motion.button
                  onClick={e => { e.stopPropagation(); removeRoom(activeProjectId, room.id); }}
                  className="opacity-0 group-hover:opacity-100 icon-btn w-5 h-5 rounded hover:bg-[rgba(239,68,68,0.1)] hover:text-[#ef4444]"
                  title="Delete room"
                  whileTap={{ scale: 0.82 }}
                >
                  <Trash2 size={10} />
                </motion.button>
              </div>

              {/* Keypads — animated expand/collapse */}
              <AnimatePresence initial={false}>
                {expandedRooms.has(room.id) && (
                  <motion.div
                    key="keypads"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="overflow-hidden"
                  >
                    <div className="ml-5 mb-1">
                      {room.keypads.map((kp, ki) => (
                        <motion.div
                          key={kp.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -4 }}
                          transition={{ delay: ki * 0.03, duration: 0.2 }}
                        >
                          <div
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
                            <motion.button
                              onClick={e => { e.stopPropagation(); removeKeypad(activeProjectId, room.id, kp.id); }}
                              className="opacity-0 group-hover:opacity-100 icon-btn w-5 h-5 rounded hover:bg-[rgba(239,68,68,0.1)] hover:text-[#ef4444]"
                              title="Delete keypad"
                              whileTap={{ scale: 0.8 }}
                            >
                              <Trash2 size={9} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}

                      <motion.button
                        onClick={() => setShowKeypadModal(room.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 w-full text-[11px] text-ink-3 hover:text-accent transition-colors mx-1.5"
                        whileHover={{ x: 2 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      >
                        <Plus size={10} />Add keypad
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
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
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileClose}
          />
          <motion.div
            className="relative z-10 flex h-full"
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {sidebarContent}
            <button onClick={onMobileClose} className="absolute top-3 right-3 icon-btn bg-surface">
              <X size={14} />
            </button>
          </motion.div>
        </div>
      )}

      <RoomFormModal projectId={activeProjectId} open={showRoomModal} onClose={() => setShowRoomModal(false)} />
      {showKeypadModal && (
        <KeypadFormModal projectId={activeProjectId} roomId={showKeypadModal} open={true} onClose={() => setShowKeypadModal(null)} />
      )}
    </>
  );
}
