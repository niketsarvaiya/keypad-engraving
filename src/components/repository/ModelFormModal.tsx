import { useState, useEffect, useRef } from 'react';
import { Plus, X, FileText, Image as ImageIcon, File } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { FormField, Btn } from '../ui/FormField';
import { useRepositoryStore } from '../../store/useRepositoryStore';
import { generateId } from '../../lib/defaults';
import type {
  KeypadModel, KeypadColor, ButtonCount, ButtonLayout,
  EngravingMethod, IndicatorType, KeypadMaterial,
} from '../../types';

const BUTTON_COUNTS: ButtonCount[] = [2, 4, 6, 8];
const ENGRAVING_METHODS: EngravingMethod[] = ['print', 'laser', 'pad-print', 'other'];

function defaultLayout(count: ButtonCount): ButtonLayout {
  return { rows: count / 2, cols: 2 };
}

function emptyModel(): Omit<KeypadModel, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    brand: '', modelNumber: '', name: '',
    buttonCount: 8, buttonLayout: defaultLayout(8),
    colors: [], hasButtonColors: false, buttonColors: [],
    indicator: 'backlit', engravingMethods: ['print'], material: 'metal', notes: '',
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  editId?: string;
}

export function ModelFormModal({ open, onClose, editId }: Props) {
  const { models, addModel, updateModel } = useRepositoryStore();
  const existing = editId ? models.find(m => m.id === editId) : undefined;
  const [form, setForm] = useState(emptyModel());
  const [newColor, setNewColor] = useState({ name: '', hex: '#8B7355' });
  const [newBtnColor, setNewBtnColor] = useState({ name: '', hex: '#FFFFFF' });
  const fileRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(editId);

  useEffect(() => {
    if (open) setForm(existing ? { ...existing } : emptyModel());
  }, [open, editId]);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  // Auto-update layout when button count changes
  const setButtonCount = (count: ButtonCount) => {
    setForm(f => ({ ...f, buttonCount: count, buttonLayout: defaultLayout(count) }));
  };

  const toggleEngraving = (m: EngravingMethod) =>
    set('engravingMethods', form.engravingMethods.includes(m)
      ? form.engravingMethods.filter(x => x !== m)
      : [...form.engravingMethods, m]
    );

  const addColor = (type: 'body' | 'button') => {
    const src = type === 'body' ? newColor : newBtnColor;
    if (!src.name.trim()) return;
    const color: KeypadColor = { id: generateId(), name: src.name.trim(), hex: src.hex };
    if (type === 'body') {
      set('colors', [...form.colors, color]);
      setNewColor({ name: '', hex: '#8B7355' });
    } else {
      set('buttonColors', [...form.buttonColors, color]);
      setNewBtnColor({ name: '', hex: '#FFFFFF' });
    }
  };

  const removeColor = (id: string, type: 'body' | 'button') => {
    if (type === 'body') set('colors', form.colors.filter(c => c.id !== id));
    else set('buttonColors', form.buttonColors.filter(c => c.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const fileType = ext === 'pdf' ? 'pdf' : ext === 'dwg' ? 'dwg' : ['png','jpg','jpeg','webp'].includes(ext) ? 'image' : 'other';

    if (fileType === 'dwg' || fileType === 'other') {
      set('layoutFile', { fileName: file.name, fileType });
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      set('layoutFile', { fileName: file.name, fileType, dataUrl: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const save = () => {
    if (!form.brand.trim() || !form.modelNumber.trim()) return;
    if (isEdit && editId) updateModel(editId, form);
    else addModel(form);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Keypad Model' : 'Add Keypad Model'}
      subtitle="Define the physical properties of this keypad"
      width="max-w-2xl"
      footer={
        <>
          <Btn label="Cancel" variant="ghost" onClick={onClose} />
          <Btn label={isEdit ? 'Save Changes' : 'Add Model'} variant="primary" onClick={save}
            disabled={!form.brand.trim() || !form.modelNumber.trim()} />
        </>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Identity */}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Brand" required>
            <input className="input-field" value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="e.g. Basalte" />
          </FormField>
          <FormField label="Model Number" required>
            <input className="input-field" value={form.modelNumber} onChange={e => set('modelNumber', e.target.value)} placeholder="e.g. Sentido" />
          </FormField>
          <div className="col-span-2">
            <FormField label="Display Name">
              <input className="input-field" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Sentido 8-Button Keypad" />
            </FormField>
          </div>
        </div>

        {/* Button count + layout */}
        <div>
          <p className="label mb-2">Button Count & Layout</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {BUTTON_COUNTS.map(c => (
              <button key={c} type="button" onClick={() => setButtonCount(c)}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold border transition-all ${
                  form.buttonCount === c ? 'bg-[#6366f1] border-[#6366f1] text-white' : 'border-[rgba(255,255,255,0.08)] text-[#8b8fa8] hover:border-[rgba(255,255,255,0.2)]'
                }`}>{c}B</button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <FormField label="Rows">
              <input type="number" min={1} max={8} className="input-field w-20"
                value={form.buttonLayout.rows}
                onChange={e => set('buttonLayout', { ...form.buttonLayout, rows: Number(e.target.value) })} />
            </FormField>
            <span className="text-[#565a72] mt-4">×</span>
            <FormField label="Cols">
              <input type="number" min={1} max={4} className="input-field w-20"
                value={form.buttonLayout.cols}
                onChange={e => set('buttonLayout', { ...form.buttonLayout, cols: Number(e.target.value) })} />
            </FormField>
            <div className="mt-4 ml-2">
              <LayoutPreview rows={form.buttonLayout.rows} cols={form.buttonLayout.cols} />
            </div>
          </div>
        </div>

        {/* Physical properties */}
        <div className="grid grid-cols-3 gap-3">
          <FormField label="Material">
            <select className="input-field" value={form.material} onChange={e => set('material', e.target.value as KeypadMaterial)}>
              <option value="metal">Metal</option>
              <option value="plastic">Plastic</option>
              <option value="glass">Glass</option>
              <option value="other">Other</option>
            </select>
          </FormField>
          <FormField label="Indicator">
            <select className="input-field" value={form.indicator} onChange={e => set('indicator', e.target.value as IndicatorType)}>
              <option value="backlit">Backlit</option>
              <option value="side-led">Side LED</option>
              <option value="none">No Indicator</option>
            </select>
          </FormField>
          <FormField label="Engraving Methods">
            <div className="flex flex-wrap gap-1.5 pt-1">
              {ENGRAVING_METHODS.map(m => (
                <button key={m} type="button" onClick={() => toggleEngraving(m)}
                  className={`px-2 py-1 rounded text-[11px] font-medium border transition-all capitalize ${
                    form.engravingMethods.includes(m)
                      ? 'bg-[rgba(99,102,241,0.15)] border-[rgba(99,102,241,0.3)] text-[#6366f1]'
                      : 'border-[rgba(255,255,255,0.08)] text-[#565a72] hover:text-[#8b8fa8]'
                  }`}>{m}</button>
              ))}
            </div>
          </FormField>
        </div>

        {/* Body Colors */}
        <div>
          <p className="label mb-2">Keypad Body Colors</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.colors.map(c => (
              <div key={c.id} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)]">
                <div className="w-4 h-4 rounded-full border border-[rgba(255,255,255,0.15)]" style={{ backgroundColor: c.hex }} />
                <span className="text-[12px] text-[#f0f1f3]">{c.name}</span>
                <button onClick={() => removeColor(c.id, 'body')} className="text-[#565a72] hover:text-[#ef4444]"><X size={11} /></button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input type="color" value={newColor.hex} onChange={e => setNewColor(n => ({ ...n, hex: e.target.value }))}
              className="w-9 h-9 rounded cursor-pointer border border-[rgba(255,255,255,0.08)] bg-transparent" />
            <input className="input-field flex-1" value={newColor.name} onChange={e => setNewColor(n => ({ ...n, name: e.target.value }))}
              placeholder="Color name e.g. Chime Brown" onKeyDown={e => e.key === 'Enter' && addColor('body')} />
            <Btn label="Add" variant="secondary" onClick={() => addColor('body')} />
          </div>
        </div>

        {/* Button Colors (optional) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="label mb-0">Button Colors</p>
            <button type="button" onClick={() => set('hasButtonColors', !form.hasButtonColors)}
              className={`w-9 h-5 rounded-full transition-colors relative ${form.hasButtonColors ? 'bg-[#6366f1]' : 'bg-[rgba(255,255,255,0.1)]'}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${form.hasButtonColors ? 'left-4' : 'left-0.5'}`} />
            </button>
          </div>
          {form.hasButtonColors && (
            <>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.buttonColors.map(c => (
                  <div key={c.id} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)]">
                    <div className="w-4 h-4 rounded-full border border-[rgba(255,255,255,0.15)]" style={{ backgroundColor: c.hex }} />
                    <span className="text-[12px] text-[#f0f1f3]">{c.name}</span>
                    <button onClick={() => removeColor(c.id, 'button')} className="text-[#565a72] hover:text-[#ef4444]"><X size={11} /></button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input type="color" value={newBtnColor.hex} onChange={e => setNewBtnColor(n => ({ ...n, hex: e.target.value }))}
                  className="w-9 h-9 rounded cursor-pointer border border-[rgba(255,255,255,0.08)] bg-transparent" />
                <input className="input-field flex-1" value={newBtnColor.name} onChange={e => setNewBtnColor(n => ({ ...n, name: e.target.value }))}
                  placeholder="e.g. White, Black, Brushed Silver" onKeyDown={e => e.key === 'Enter' && addColor('button')} />
                <Btn label="Add" variant="secondary" onClick={() => addColor('button')} />
              </div>
            </>
          )}
        </div>

        {/* Layout File */}
        <div>
          <p className="label mb-2">Layout Reference File</p>
          <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.dwg" className="hidden" onChange={handleFileUpload} />
          {form.layoutFile ? (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]">
              {form.layoutFile.fileType === 'pdf' ? <FileText size={18} className="text-[#3b82f6]" /> :
               form.layoutFile.fileType === 'image' ? <ImageIcon size={18} className="text-[#10b981]" /> :
               <File size={18} className="text-[#8b8fa8]" />}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#f0f1f3] truncate">{form.layoutFile.fileName}</p>
                <p className="text-[11px] text-[#565a72] uppercase">{form.layoutFile.fileType}</p>
              </div>
              {form.layoutFile.fileType === 'image' && form.layoutFile.dataUrl && (
                <img src={form.layoutFile.dataUrl} alt="preview" className="w-16 h-12 object-cover rounded border border-[rgba(255,255,255,0.1)]" />
              )}
              <button onClick={() => set('layoutFile', undefined)} className="text-[#565a72] hover:text-[#ef4444]"><X size={14} /></button>
            </div>
          ) : (
            <button onClick={() => fileRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-lg border border-dashed border-[rgba(255,255,255,0.1)] hover:border-[rgba(99,102,241,0.4)] hover:bg-[rgba(99,102,241,0.04)] transition-all text-[#565a72] hover:text-[#6366f1]">
              <Plus size={18} />
              <p className="text-[12px] font-medium">Upload PDF, Image, or DWG</p>
            </button>
          )}
        </div>

        <FormField label="Notes">
          <textarea className="input-field resize-none" rows={2} value={form.notes}
            onChange={e => set('notes', e.target.value)} placeholder="Any notes about this keypad model..." />
        </FormField>
      </div>
    </Modal>
  );
}

function LayoutPreview({ rows, cols }: { rows: number; cols: number }) {
  return (
    <div className="inline-grid gap-0.5 p-1 rounded bg-[rgba(255,255,255,0.06)]"
      style={{ gridTemplateColumns: `repeat(${cols}, 16px)`, gridTemplateRows: `repeat(${rows}, 12px)` }}>
      {Array.from({ length: rows * cols }, (_, i) => (
        <div key={i} className="rounded-sm bg-[rgba(99,102,241,0.4)]" />
      ))}
    </div>
  );
}
