import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { FormField, Btn } from '../ui/FormField';
import { useStore } from '../../store/useStore';
import type { EngravingProject } from '../../types';

interface Props {
  projectId: string;
  open: boolean;
  onClose: () => void;
}

export function ProjectSetupModal({ projectId, open, onClose }: Props) {
  const { projects, updateProject } = useStore();
  const project = projects.find(p => p.id === projectId);

  const [form, setForm] = useState<Partial<EngravingProject>>({});

  useEffect(() => {
    if (project && open) setForm({ ...project });
  }, [project, open]);

  if (!project) return null;

  const set = (k: keyof EngravingProject, v: unknown) =>
    setForm(f => ({ ...f, [k]: v }));

  const setSettings = (k: string, v: unknown) =>
    setForm(f => ({ ...f, settings: { ...f.settings!, [k]: v } }));

  const save = () => {
    updateProject(projectId, form);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Project Settings"
      subtitle="Update project details and global engraving settings"
      width="max-w-2xl"
      footer={
        <>
          <Btn label="Cancel" variant="ghost" onClick={onClose} />
          <Btn label="Save Changes" variant="primary" onClick={save} />
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Project Name" required>
          <input className="input-field" value={form.name ?? ''} onChange={e => set('name', e.target.value)} />
        </FormField>
        <FormField label="Client Name">
          <input className="input-field" value={form.client ?? ''} onChange={e => set('client', e.target.value)} />
        </FormField>
        <FormField label="Project Code">
          <input className="input-field" value={form.projectCode ?? ''} onChange={e => set('projectCode', e.target.value)} />
        </FormField>
        <FormField label="Prepared By">
          <input className="input-field" value={form.preparedBy ?? ''} onChange={e => set('preparedBy', e.target.value)} />
        </FormField>
        <FormField label="Date">
          <input className="input-field" type="date" value={form.date ?? ''} onChange={e => set('date', e.target.value)} />
        </FormField>
        <FormField label="Revision">
          <input className="input-field" type="number" min={1} value={form.revision ?? 1} onChange={e => set('revision', Number(e.target.value))} />
        </FormField>
      </div>

      <div className="mt-4">
        <FormField label="Global Notes">
          <textarea
            className="input-field resize-none"
            rows={2}
            value={form.globalNotes ?? ''}
            onChange={e => set('globalNotes', e.target.value)}
            placeholder="e.g. All keypads color Chime Brown & Printing White Color"
          />
        </FormField>
      </div>

      <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.06)]">
        <p className="label mb-4">Global Engraving Settings</p>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Keypad Finish">
            <input
              className="input-field"
              value={form.settings?.keypayFinish ?? ''}
              onChange={e => setSettings('keypayFinish', e.target.value)}
              placeholder="e.g. Chime Brown"
            />
          </FormField>
          <FormField label="Printing Color">
            <input
              className="input-field"
              value={form.settings?.printingColor ?? ''}
              onChange={e => setSettings('printingColor', e.target.value)}
              placeholder="e.g. White"
            />
          </FormField>
          <FormField label="Font Style">
            <select
              className="input-field"
              value={form.settings?.fontStyle ?? 'Sans Serif'}
              onChange={e => setSettings('fontStyle', e.target.value)}
            >
              <option>Sans Serif</option>
              <option>Serif</option>
              <option>Monospace</option>
              <option>Rounded</option>
            </select>
          </FormField>
          <FormField label="Text Case">
            <select
              className="input-field"
              value={form.settings?.textCase ?? 'uppercase'}
              onChange={e => setSettings('textCase', e.target.value)}
            >
              <option value="uppercase">UPPERCASE</option>
              <option value="titlecase">Title Case</option>
            </select>
          </FormField>
          <FormField label="Icon Usage">
            <div className="flex items-center gap-3 h-10">
              <button
                type="button"
                onClick={() => setSettings('useIcons', !form.settings?.useIcons)}
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  form.settings?.useIcons ? 'bg-[#6366f1]' : 'bg-[rgba(255,255,255,0.1)]'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                  form.settings?.useIcons ? 'left-5' : 'left-1'
                }`} />
              </button>
              <span className="text-[12px] text-[#8b8fa8]">
                {form.settings?.useIcons ? 'Icons enabled' : 'Text only'}
              </span>
            </div>
          </FormField>
        </div>
      </div>
    </Modal>
  );
}

// ─── New Project Modal ──────────────────────────────────────────────────────

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (id: string) => void;
}

export function NewProjectModal({ open, onClose, onCreate }: NewProjectModalProps) {
  const { createProject } = useStore();
  const [form, setForm] = useState({ name: '', client: '', projectCode: '', preparedBy: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleCreate = () => {
    if (!form.name.trim()) return;
    const id = createProject({ ...form });
    setForm({ name: '', client: '', projectCode: '', preparedBy: '' });
    onCreate(id);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Engraving Project"
      subtitle="Enter project details to get started"
      width="max-w-lg"
      footer={
        <>
          <Btn label="Cancel" variant="ghost" onClick={onClose} />
          <Btn label="Create Project" variant="primary" onClick={handleCreate} disabled={!form.name.trim()} />
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField label="Project Name" required>
          <input className="input-field" autoFocus value={form.name} onChange={set('name')} placeholder="e.g. Villa Serenova" />
        </FormField>
        <FormField label="Client Name">
          <input className="input-field" value={form.client} onChange={set('client')} placeholder="e.g. Mr. & Mrs. Mehta" />
        </FormField>
        <FormField label="Project Code">
          <input className="input-field" value={form.projectCode} onChange={set('projectCode')} placeholder="e.g. BYA-2025-014" />
        </FormField>
        <FormField label="Prepared By">
          <input className="input-field" value={form.preparedBy} onChange={set('preparedBy')} placeholder="Your name" />
        </FormField>
      </div>
    </Modal>
  );
}
