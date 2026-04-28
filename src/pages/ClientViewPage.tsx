import { ArrowLeft, Printer } from 'lucide-react';
import { useStore } from '../store/useStore';

export function ClientViewPage() {
  const { activeProject, setView } = useStore();
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
            {/* Room heading */}
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[rgba(255,255,255,0.1)]">
              <div className="w-1 h-6 rounded-full bg-[#6366f1]" />
              <h2 className="text-[18px] font-bold text-[#f0f1f3]">{room.name}</h2>
              <span className="text-[12px] text-[#565a72]">{room.type}</span>
            </div>

            {/* Keypads grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {room.keypads.map(kp => (
                <ClientKeypadCard key={kp.id} keypad={kp} textCase={project.settings.textCase} />
              ))}
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

function ClientKeypadCard({
  keypad,
  textCase,
}: {
  keypad: { name: string; location: string; brand: string; model: string; buttonCount: number; quantity: number; notes: string; buttons: Array<{ id: string; position: number; label: string }> };
  textCase: 'uppercase' | 'titlecase';
}) {
  const rows = keypad.buttonCount / 2;
  const grid = Array.from({ length: rows }, (_, r) =>
    keypad.buttons.slice(r * 2, r * 2 + 2)
  );

  const fmt = (s: string) =>
    textCase === 'uppercase' ? s.toUpperCase() : s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.1)] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-[#f0f1f3]">{keypad.name || keypad.location}</p>
            <p className="text-[11px] text-[#565a72] mt-0.5">
              {[keypad.location, keypad.brand, keypad.model].filter(Boolean).join(' · ')}
            </p>
          </div>
          {keypad.quantity > 1 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[#8b8fa8]">Qty: {keypad.quantity}</span>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="p-3">
        <div
          className="grid border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden"
          style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: `repeat(${rows}, 1fr)` }}
        >
          {grid.map(row =>
            row.map(btn => (
              <div
                key={btn.id}
                className="flex items-center justify-center min-h-[48px] px-2 border-[rgba(255,255,255,0.06)] border"
              >
                <span className="text-[11px] font-semibold tracking-wider text-center text-[#f0f1f3]">
                  {btn.label ? fmt(btn.label) : <span className="text-[#565a72] font-normal text-[10px]">—</span>}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
