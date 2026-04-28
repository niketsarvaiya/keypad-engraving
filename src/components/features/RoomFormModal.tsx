import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { FormField, Btn } from '../ui/FormField';
import { useStore } from '../../store/useStore';
import { ROOM_TYPES } from '../../lib/defaults';
import type { RoomType } from '../../types';

interface Props {
  projectId: string;
  open: boolean;
  onClose: () => void;
  editRoomId?: string;
}

export function RoomFormModal({ projectId, open, onClose, editRoomId }: Props) {
  const { projects, addRoom, updateRoom } = useStore();
  const project = projects.find(p => p.id === projectId);
  const existingRoom = editRoomId ? project?.rooms.find(r => r.id === editRoomId) : undefined;

  const [form, setForm] = useState({ name: existingRoom?.name ?? '', type: existingRoom?.type ?? 'Living Room' as RoomType, notes: existingRoom?.notes ?? '' });

  const isEdit = Boolean(editRoomId);

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    if (isEdit && editRoomId) {
      updateRoom(projectId, editRoomId, form);
    } else {
      addRoom(projectId, { name: form.name, type: form.type as RoomType, notes: form.notes });
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Room' : 'Add Room'}
      subtitle={isEdit ? 'Update room details' : 'Add a new room to this project'}
      width="max-w-md"
      footer={
        <>
          <Btn label="Cancel" variant="ghost" onClick={onClose} />
          <Btn label={isEdit ? 'Save' : 'Add Room'} variant="primary" onClick={handleSubmit} disabled={!form.name.trim()} />
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField label="Room Name" required>
          <input
            className="input-field"
            autoFocus
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Master Bedroom"
          />
        </FormField>
        <FormField label="Room Type">
          <select
            className="input-field"
            value={form.type}
            onChange={e => setForm(f => ({ ...f, type: e.target.value as RoomType }))}
          >
            {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </FormField>
        <FormField label="Notes">
          <textarea
            className="input-field resize-none"
            rows={2}
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Any special notes for this room..."
          />
        </FormField>
      </div>
    </Modal>
  );
}
