import { Cpu, Pencil, Trash2, FileText, Image } from 'lucide-react';
import type { KeypadModel } from '../../types';

const INDICATOR_LABEL: Record<string, string> = {
  backlit: 'Backlit', 'side-led': 'Side LED', none: 'No Indicator',
};
const MATERIAL_LABEL: Record<string, string> = {
  metal: 'Metal', plastic: 'Plastic', glass: 'Glass', other: 'Other',
};

interface Props {
  model: KeypadModel;
  onEdit: () => void;
  onDelete: () => void;
}

export function ModelCard({ model, onEdit, onDelete }: Props) {
  return (
    <div className="card group hover:border-[rgba(255,255,255,0.1)] transition-all">
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-9 h-9 rounded-lg bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.15)] flex items-center justify-center shrink-0">
            <Cpu size={16} className="text-[#6366f1]" />
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.08)] text-[#565a72] hover:text-[#f0f1f3] transition-colors"
              title="Edit model"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg hover:bg-[rgba(239,68,68,0.1)] text-[#565a72] hover:text-[#ef4444] transition-colors"
              title="Delete model"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Name */}
        <p className="text-[11px] text-[#565a72] uppercase tracking-widest mb-0.5">{model.brand}</p>
        <h3 className="text-[14px] font-semibold text-[#f0f1f3] truncate">{model.modelNumber}</h3>
        {model.name && <p className="text-[12px] text-[#8b8fa8] mt-0.5 truncate">{model.name}</p>}

        {/* Colors */}
        {model.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3">
            {model.colors.map(c => (
              <div
                key={c.id}
                className="w-5 h-5 rounded-full border-2 border-[rgba(255,255,255,0.12)] shrink-0"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {model.colors.length > 6 && (
              <span className="text-[10px] text-[#565a72]">+{model.colors.length - 6}</span>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          <Tag>{model.buttonCount}B · {model.buttonLayout.rows}×{model.buttonLayout.cols}</Tag>
          <Tag>{MATERIAL_LABEL[model.material]}</Tag>
          <Tag>{INDICATOR_LABEL[model.indicator]}</Tag>
          {model.engravingMethods.map(m => <Tag key={m}>{m}</Tag>)}
        </div>

        {/* Layout file indicator */}
        {model.layoutFile && (
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-[#8b8fa8]">
            {model.layoutFile.fileType === 'pdf' ? <FileText size={11} /> : <Image size={11} />}
            {model.layoutFile.fileName}
          </div>
        )}
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[rgba(255,255,255,0.05)] text-[#8b8fa8] border border-[rgba(255,255,255,0.06)]">
      {children}
    </span>
  );
}
