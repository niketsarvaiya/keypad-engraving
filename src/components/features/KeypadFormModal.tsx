import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { FormField, Btn } from '../ui/FormField';
import { useStore } from '../../store/useStore';
import { BUTTON_COUNTS, KEYPAD_LOCATIONS } from '../../lib/defaults';
import type { ButtonCount } from '../../types';

interface Props {
  projectId: string;
  roomId: string;
  open: boolean;
  onClose: () => void;
}

const defaultForm = {
  name: '',
  location: '',
  buttonCount: 8 as ButtonCount,
  brand: '',
  model: '',
  finish: '',
  quantity: 1,
  notes: '',
};

export function KeypadFormModal({ projectId, roomId, open, onClose }: Props) {
  const { addKeypad, activeProject } = useStore();
  const project = activeProject();
  const [form, setForm] = useState({ ...defaultForm, finish: project?.settings.keypayFinish ?? '' });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: k === 'buttonCount' || k === 'quantity' ? Number(e.target.value) : e.target.value }));

  const handleSubmit = () => {
    addKeypad(projectId, roomId, { ...form, buttonCount: form.buttonCount as ButtonCount });
    setForm({ ...defaultForm, finish: project?.settings.keypayFinish ?? '' });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Keypad"
      subtitle="Configure this keypad's details and button count"
      width="max-w-lg"
      footer={
        <>
          <Btn label="Cancel" variant="ghost" onClick={onClose} />
          <Btn label="Add Keypad" variant="primary" onClick={handleSubmit} />
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Keypad Name">
          <input className="input-field" autoFocus value={form.name} onChange={set('name')} placeholder="e.g. Bedside Keypad" />
        </FormField>
        <FormField label="Location">
          <select className="input-field" value={form.location} onChange={set('location')}>
            <option value="">Select location...</option>
            {KEYPAD_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </FormField>

        <FormField label="Button Count">
          <div className="flex gap-2">
            {BUTTON_COUNTS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setForm(f => ({ ...f, buttonCount: c }))}
                className={`flex-1 py-2 rounded-lg text-[13px] font-semibold border transition-all ${
                  form.buttonCount === c
                    ? 'bg-[#6366f1] border-[#6366f1] text-white'
                    : 'border-[rgba(255,255,255,0.08)] text-[#8b8fa8] hover:border-[rgba(255,255,255,0.2)]'
                }`}
              >
                {c}B
              </button>
            ))}
          </div>
        </FormField>

        <FormField label="Quantity">
          <input className="input-field" type="number" min={1} max={20} value={form.quantity} onChange={set('quantity')} />
        </FormField>

        <FormField label="Brand">
          <input className="input-field" value={form.brand} onChange={set('brand')} placeholder="e.g. Basalte" />
        </FormField>
        <FormField label="Model">
          <input className="input-field" value={form.model} onChange={set('model')} placeholder="e.g. Sentido" />
        </FormField>
        <FormField label="Finish" hint="Leave blank to use global setting">
          <input className="input-field" value={form.finish} onChange={set('finish')} placeholder="e.g. Chime Brown" />
        </FormField>

        <div className="col-span-2">
          <FormField label="Notes">
            <textarea className="input-field resize-none" rows={2} value={form.notes} onChange={set('notes')} placeholder="Any notes about this keypad..." />
          </FormField>
        </div>
      </div>
    </Modal>
  );
}
