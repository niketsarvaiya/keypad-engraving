import { useState } from 'react';
import { Cpu } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { FormField, Btn } from '../ui/FormField';
import { useStore } from '../../store/useStore';
import { useRepositoryStore } from '../../store/useRepositoryStore';
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
  modelId: '',
  finish: '',
  quantity: 1,
  notes: '',
};

export function KeypadFormModal({ projectId, roomId, open, onClose }: Props) {
  const { addKeypad, activeProject } = useStore();
  const { models } = useRepositoryStore();
  const project = activeProject();
  const [form, setForm] = useState({ ...defaultForm, finish: project?.settings.keypayFinish ?? '' });
  const [step, setStep] = useState<'model' | 'details'>('model');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: k === 'buttonCount' || k === 'quantity' ? Number(e.target.value) : e.target.value }));

  const pickModel = (m: typeof models[0]) => {
    setForm(f => ({
      ...f,
      modelId: m.id,
      brand: m.brand,
      model: m.modelNumber,
      buttonCount: m.buttonCount,
      finish: m.colors[0]?.name ?? f.finish,
    }));
    setStep('details');
  };

  const skipModel = () => { setForm(f => ({ ...f, modelId: '' })); setStep('details'); };

  const handleSubmit = () => {
    const { modelId, ...rest } = form;
    addKeypad(projectId, roomId, { ...rest, buttonCount: form.buttonCount as ButtonCount, ...(modelId ? { modelId } : {}) });
    setForm({ ...defaultForm, finish: project?.settings.keypayFinish ?? '' });
    setStep('model');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={() => { setStep('model'); onClose(); }}
      title={step === 'model' ? 'Select Keypad Model' : 'Configure Keypad'}
      subtitle={step === 'model' ? 'Choose from repository or skip to enter manually' : 'Set location, quantity, and layout'}
      width="max-w-lg"
      footer={
        step === 'model' ? (
          <Btn label="Skip — Enter Manually" variant="ghost" onClick={skipModel} />
        ) : (
          <>
            {models.length > 0 && <Btn label="← Back" variant="ghost" onClick={() => setStep('model')} />}
            <Btn label="Add Keypad" variant="primary" onClick={handleSubmit} />
          </>
        )
      }
    >
      {step === 'model' ? (
        <div className="flex flex-col gap-2">
          {models.length === 0 ? (
            <div className="py-8 text-center">
              <Cpu size={28} className="text-[#565a72] mx-auto mb-2" />
              <p className="text-[13px] text-[#8b8fa8]">No models in repository yet.</p>
              <button onClick={skipModel} className="mt-3 text-[12px] text-[#6366f1] hover:underline">
                Continue without model
              </button>
            </div>
          ) : (
            models.map(m => (
              <button
                key={m.id}
                onClick={() => pickModel(m)}
                className="flex items-center gap-3 p-3 rounded-xl border border-[rgba(255,255,255,0.06)] hover:border-[rgba(99,102,241,0.3)] hover:bg-[rgba(99,102,241,0.05)] text-left transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.15)] flex items-center justify-center shrink-0">
                  <Cpu size={16} className="text-[#6366f1]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#f0f1f3] truncate">{m.brand} {m.modelNumber}</p>
                  <p className="text-[11px] text-[#565a72]">{m.buttonCount}B · {m.material} · {m.indicator}</p>
                </div>
                {m.colors.length > 0 && (
                  <div className="flex gap-1 shrink-0">
                    {m.colors.slice(0, 4).map(c => (
                      <div key={c.id} className="w-4 h-4 rounded-full border border-[rgba(255,255,255,0.15)]" style={{ backgroundColor: c.hex }} />
                    ))}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {form.modelId && (
            <div className="col-span-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgba(99,102,241,0.08)] border border-[rgba(99,102,241,0.2)]">
              <Cpu size={13} className="text-[#6366f1]" />
              <span className="text-[12px] text-[#6366f1]">{form.brand} {form.model}</span>
            </div>
          )}

          <FormField label="Keypad Name">
            <input className="input-field" autoFocus value={form.name} onChange={set('name')} placeholder="e.g. Bedside Keypad" />
          </FormField>
          <FormField label="Location">
            <select className="input-field" value={form.location} onChange={set('location')}>
              <option value="">Select…</option>
              {KEYPAD_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </FormField>

          <FormField label="Button Count">
            <div className="flex gap-2">
              {BUTTON_COUNTS.map(c => (
                <button key={c} type="button"
                  onClick={() => setForm(f => ({ ...f, buttonCount: c }))}
                  className={`flex-1 py-2 rounded-lg text-[13px] font-semibold border transition-all ${
                    form.buttonCount === c
                      ? 'bg-[#6366f1] border-[#6366f1] text-white'
                      : 'border-[rgba(255,255,255,0.08)] text-[#8b8fa8] hover:border-[rgba(255,255,255,0.2)]'
                  }`}>{c}B</button>
              ))}
            </div>
          </FormField>

          <FormField label="Quantity">
            <input className="input-field" type="number" min={1} max={20} value={form.quantity} onChange={set('quantity')} />
          </FormField>

          {!form.modelId && (
            <>
              <FormField label="Brand">
                <input className="input-field" value={form.brand} onChange={set('brand')} placeholder="e.g. Basalte" />
              </FormField>
              <FormField label="Finish">
                <input className="input-field" value={form.finish} onChange={set('finish')} placeholder="e.g. Chime Brown" />
              </FormField>
            </>
          )}

          <div className="col-span-2">
            <FormField label="Notes">
              <textarea className="input-field resize-none" rows={2} value={form.notes} onChange={set('notes')} placeholder="Any notes…" />
            </FormField>
          </div>
        </div>
      )}
    </Modal>
  );
}
