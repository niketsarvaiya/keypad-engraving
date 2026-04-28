import { ArrowLeft, Printer } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useRepositoryStore } from '../store/useRepositoryStore';
import { ICON_MAP } from '../lib/defaults';
import type { Keypad, TextCase, EngravingMode } from '../types';

// ─── Color helpers (same as KeypadVisual) ─────────────────────────────────────

function getLuminance(hex: string): number {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function isDark(hex: string): boolean {
  return getLuminance(hex) < 0.45;
}

function shiftBrightness(hex: string, amount: number): string {
  const h = hex.replace('#', '');
  const r = Math.min(255, Math.max(0, parseInt(h.substring(0, 2), 16) + amount));
  const g = Math.min(255, Math.max(0, parseInt(h.substring(2, 4), 16) + amount));
  const b = Math.min(255, Math.max(0, parseInt(h.substring(4, 6), 16) + amount));
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function ClientViewPage() {
  const { activeProject, setView } = useStore();
  const { models } = useRepositoryStore();
  const project = activeProject();

  if (!project) return null;

  const statusLabels: Record<string, string> = {
    'draft': 'Draft',
    'shared-with-client': 'Shared with Client',
    'changes-requested': 'Changes Requested',
    'approved': 'Approved',
    'sent-for-engraving': 'Sent for Engraving',
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-[#f0f1f3]">
      {/* Toolbar — hidden in print */}
      <div className="no-print sticky top-0 z-10 flex items-center gap-3 px-6 py-3 bg-[#0f1117] border-b border-[rgba(255,255,255,0.06)]">
        <button
          onClick={() => setView('editor')}
          className="flex items-center gap-1.5 text-[12px] text-[#8b8fa8] hover:text-[#f0f1f3] transition-colors"
        >
          <ArrowLeft size={14} /> Back to Editor
        </button>
        <div className="flex-1" />
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#6366f1] hover:bg-[#4f52e0] text-white text-[12px] font-medium transition-colors"
        >
          <Printer size={13} /> Print / Save PDF
        </button>
      </div>

      {/* Print content */}
      <div className="max-w-4xl mx-auto px-8 py-10 print-content">
        {/* ── Cover page ── */}
        <div className="print-page mb-16">
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[rgba(99,102,241,0.3)] bg-[rgba(99,102,241,0.08)]">
              <div className="w-4 h-4 rounded bg-[#6366f1]" />
              <span className="text-[11px] font-medium text-[#6366f1] uppercase tracking-widest">Beyond Finesse</span>
            </div>
            <h1 className="text-[32px] font-bold text-[#f0f1f3] mb-2">{project.name}</h1>
            <p className="text-[16px] text-[#8b8fa8] mb-8">Keypad Engraving Layout</p>

            <div className="inline-grid grid-cols-2 gap-x-16 gap-y-4 text-left mt-8">
              {[
                { label: 'Client', value: project.client },
                { label: 'Project Code', value: project.projectCode },
                { label: 'Prepared By', value: project.preparedBy },
                { label: 'Date', value: project.date },
                { label: 'Revision', value: `R${project.revision}` },
                { label: 'Status', value: statusLabels[project.status] ?? project.status },
              ].map(row => (
                row.value ? (
                  <div key={row.label}>
                    <p className="text-[11px] text-[#565a72] uppercase tracking-widest mb-0.5">{row.label}</p>
                    <p className="text-[14px] text-[#f0f1f3] font-medium">{row.value}</p>
                  </div>
                ) : null
              ))}
            </div>

            {project.globalNotes && (
              <div className="mt-10 p-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] max-w-sm mx-auto">
                <p className="text-[12px] text-[#8b8fa8] italic">{project.globalNotes}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Room pages ── */}
        {project.rooms.map((room, ri) => (
          <div key={room.id} className={ri < project.rooms.length - 1 ? 'print-page mb-12' : 'mb-12'}>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[rgba(255,255,255,0.1)]">
              <div className="w-1 h-6 rounded-full bg-[#6366f1]" />
              <h2 className="text-[18px] font-bold text-[#f0f1f3]">{room.name}</h2>
              <span className="text-[12px] text-[#565a72]">{room.type}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {room.keypads.map(kp => {
                const model = kp.modelId ? models.find(m => m.id === kp.modelId) : null;
                const bodyColor = model && kp.selectedColorId
                  ? model.colors.find(c => c.id === kp.selectedColorId)
                  : null;
                const bodyHex = bodyColor?.hex ?? kp.finish?.startsWith('#') ? kp.finish : undefined;
                return (
                  <ClientKeypadCard
                    key={kp.id}
                    keypad={kp}
                    textCase={project.settings.textCase}
                    bodyHex={bodyHex}
                    models={models}
                  />
                );
              })}
            </div>

            {room.notes && (
              <p className="mt-4 text-[12px] text-[#8b8fa8] italic">{room.notes}</p>
            )}
          </div>
        ))}

        {/* ── Signature ── */}
        <div className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.1)]">
          <div className="grid grid-cols-2 gap-12">
            <div>
              <div className="h-12 border-b border-[rgba(255,255,255,0.15)] mb-2" />
              <p className="text-[11px] text-[#565a72]">Client Approval Signature</p>
              <p className="text-[11px] text-[#565a72] mt-0.5">Date: ___________________</p>
            </div>
            <div>
              <div className="h-12 border-b border-[rgba(255,255,255,0.15)] mb-2" />
              <p className="text-[11px] text-[#565a72]">Prepared By — Beyond Alliance</p>
              <p className="text-[11px] text-[#565a72] mt-0.5">{project.preparedBy || '___________________'}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-[#565a72]">
            {project.projectCode} · Revision R{project.revision} · {project.date} · Confidential
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── ClientKeypadCard ─────────────────────────────────────────────────────────

function ClientKeypadCard({
  keypad,
  textCase,
  bodyHex,
  models,
}: {
  keypad: Keypad;
  textCase: TextCase;
  bodyHex?: string;
  models: ReturnType<typeof useRepositoryStore.getState>['models'];
}) {
  const rows = keypad.buttonCount / 2;

  const fmt = (s: string) =>
    textCase === 'uppercase'
      ? s.toUpperCase()
      : s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

  // Resolve physical colors
  const dark = bodyHex ? isDark(bodyHex) : true;
  const printColor = bodyHex ? (dark ? '#ffffff' : '#111318') : '#f0f1f3';
  const headerBg = bodyHex ? shiftBrightness(bodyHex, dark ? 15 : -15) : undefined;
  const buttonBg = bodyHex ? shiftBrightness(bodyHex, dark ? 22 : -22) : undefined;
  const borderColor = bodyHex
    ? `${shiftBrightness(bodyHex, dark ? 30 : -30)}66`
    : 'rgba(255,255,255,0.1)';

  // For no-color case, use theme-aware classes; for physical color, inline styles
  const model = keypad.modelId ? models.find(m => m.id === keypad.modelId) : null;

  if (!bodyHex) {
    // ── No physical color: theme-responsive card ──────────────────────────────
    return (
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-[#f0f1f3]">{keypad.name || keypad.location}</p>
              <p className="text-[11px] text-[#565a72] mt-0.5">
                {[keypad.location, keypad.brand, keypad.model].filter(Boolean).join(' · ')}
              </p>
            </div>
            {keypad.quantity > 1 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[#8b8fa8]">
                Qty: {keypad.quantity}
              </span>
            )}
          </div>
        </div>
        <div className="p-3">
          <div
            className="grid border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden"
            style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: `repeat(${rows}, 1fr)` }}
          >
            {Array.from({ length: rows }, (_, r) =>
              keypad.buttons.slice(r * 2, r * 2 + 2).map(btn => {
                const mode: EngravingMode = btn.engravingMode ?? 'text';
                const IconComp = btn.icon ? ICON_MAP[btn.icon] : null;
                return (
                  <div
                    key={btn.id}
                    className="flex flex-col items-center justify-center min-h-[52px] px-2 gap-1 border border-[rgba(255,255,255,0.06)]"
                  >
                    {(mode === 'icon' || mode === 'text+icon') && IconComp && (
                      <IconComp size={13} className="text-[#f0f1f3] opacity-80" />
                    )}
                    {(mode === 'text' || mode === 'text+icon') && (
                      <span className="text-[11px] font-semibold tracking-wider text-center text-[#f0f1f3]">
                        {btn.label ? fmt(btn.label) : <span className="text-[#565a72] font-normal text-[10px]">—</span>}
                      </span>
                    )}
                    {mode === 'icon' && !IconComp && (
                      <span className="text-[#565a72] text-[10px]">—</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Physical color card ─────────────────────────────────────────────────────
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: bodyHex, border: `1px solid ${borderColor}` }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b"
        style={{ background: headerBg, borderColor }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold" style={{ color: printColor }}>
              {keypad.name || keypad.location}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: `${printColor}99` }}>
              {[keypad.location, keypad.brand, keypad.model].filter(Boolean).join(' · ')}
            </p>
          </div>
          {keypad.quantity > 1 && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded"
              style={{ background: `${printColor}22`, color: printColor }}
            >
              Qty: {keypad.quantity}
            </span>
          )}
        </div>
      </div>

      {/* Button grid */}
      <div className="p-3">
        <div
          className="grid rounded-lg overflow-hidden"
          style={{
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: 2,
            background: borderColor,
          }}
        >
          {Array.from({ length: rows }, (_, r) =>
            keypad.buttons.slice(r * 2, r * 2 + 2).map(btn => {
              const mode: EngravingMode = btn.engravingMode ?? 'text';
              const IconComp = btn.icon ? ICON_MAP[btn.icon] : null;
              const btnColorHex = (model?.hasButtonColors && keypad.selectedButtonColors?.[btn.position])
                ? model.buttonColors.find(c => c.id === keypad.selectedButtonColors![btn.position])?.hex
                : undefined;
              const cellBg = btnColorHex ?? buttonBg!;
              const cellPrint = btnColorHex
                ? (isDark(btnColorHex) ? '#ffffff' : '#111318')
                : printColor;
              return (
                <div
                  key={btn.id}
                  className="flex flex-col items-center justify-center min-h-[52px] px-2 gap-1"
                  style={{ background: cellBg }}
                >
                  {(mode === 'icon' || mode === 'text+icon') && IconComp && (
                    <IconComp size={13} style={{ color: cellPrint, opacity: 0.9 }} />
                  )}
                  {(mode === 'text' || mode === 'text+icon') && (
                    <span className="text-[11px] font-semibold tracking-wider text-center" style={{ color: cellPrint }}>
                      {btn.label ? fmt(btn.label) : <span style={{ color: `${cellPrint}40`, fontWeight: 400, fontSize: 10 }}>—</span>}
                    </span>
                  )}
                  {mode === 'icon' && !IconComp && (
                    <span style={{ color: `${cellPrint}40`, fontSize: 10 }}>—</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
