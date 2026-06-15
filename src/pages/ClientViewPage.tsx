import { ArrowLeft, Printer } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useRepositoryStore } from '../store/useRepositoryStore';

// ─── Motion variants ──────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const coverVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const coverItem = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const roomsVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};
const roomVariant = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const keypadsVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const keypadVariant = {
  hidden: { opacity: 0, scale: 0.96, y: 10 },
  show:   { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.38, ease: EASE } },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export function ClientViewPage() {
  const { activeProject, setView } = useStore();
  const { getModel } = useRepositoryStore();
  const project = activeProject();

  if (!project) return null;

  const statusLabels: Record<string, string> = {
    'draft':               'Draft',
    'shared-with-client':  'Shared with Client',
    'changes-requested':   'Changes Requested',
    'approved':            'Approved',
    'sent-for-engraving':  'Sent for Engraving',
  };

  return (
    <div className="min-h-screen bg-base text-ink">

      {/* ── Toolbar ──────────────────────────────────────────────── */}
      <div className="no-print sticky top-0 z-10 flex items-center gap-3 px-6 py-3 bg-surface border-b border-line">
        <motion.button
          onClick={() => setView('editor')}
          className="flex items-center gap-1.5 text-[12px] text-ink-2 hover:text-ink transition-colors"
          whileHover={{ x: -2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        >
          <ArrowLeft size={14} /> Back to Editor
        </motion.button>
        <div className="flex-1" />
        <motion.button
          onClick={() => window.print()}
          className="btn-primary text-[12px] py-1.5 px-3.5"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
        >
          <Printer size={13} /> Print / Save PDF
        </motion.button>
      </div>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-8 py-12 print-content">

        {/* ── Cover ─────────────────────────────────────────────── */}
        <div className="print-page mb-16">
          <motion.div
            className="text-center py-14 relative"
            variants={coverVariants}
            initial="hidden"
            animate="show"
          >
            {/* Decorative glow (no-print) */}
            <div className="no-print absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-96 h-40 rounded-full animate-glow"
                style={{ background: 'radial-gradient(ellipse, var(--accent) 0%, transparent 70%)', filter: 'blur(60px)', opacity: 0.08 }}
              />
            </div>

            {/* Badge */}
            <motion.div variants={coverItem} className="inline-flex items-center gap-2 mb-8 px-3.5 py-1.5 rounded-full border border-accent bg-accent-dim">
              <motion.div
                className="w-4 h-4 rounded-md bg-accent"
                animate={{ rotate: [0, 6, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              />
              <span className="text-[11px] font-semibold text-accent uppercase tracking-widest">Beyond Finesse</span>
            </motion.div>

            {/* Title */}
            <motion.h1 variants={coverItem} className="text-[38px] font-bold text-ink mb-2" style={{ letterSpacing: '-0.025em' }}>
              {project.name}
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={coverItem} className="text-[17px] text-ink-2 mb-10">
              Keypad Engraving Layout
            </motion.p>

            {/* Metadata grid */}
            <motion.div variants={coverItem} className="inline-grid grid-cols-2 gap-x-16 gap-y-5 text-left mt-4">
              {[
                { label: 'Client',       value: project.client },
                { label: 'Project Code', value: project.projectCode },
                { label: 'Prepared By',  value: project.preparedBy },
                { label: 'Date',         value: project.date },
                { label: 'Revision',     value: `R${project.revision}` },
                { label: 'Status',       value: statusLabels[project.status] ?? project.status },
              ].map(row => row.value ? (
                <div key={row.label}>
                  <p className="text-[10px] font-semibold text-ink-3 uppercase tracking-[0.08em] mb-0.5">{row.label}</p>
                  <p className="text-[14px] text-ink font-medium">{row.value}</p>
                </div>
              ) : null)}
            </motion.div>

            {/* Global notes */}
            {project.globalNotes && (
              <motion.div variants={coverItem} className="mt-10 p-5 rounded-2xl border border-line bg-raised max-w-sm mx-auto">
                <p className="text-[12px] text-ink-2 italic leading-relaxed">{project.globalNotes}</p>
              </motion.div>
            )}

            {/* Decorative divider dots */}
            <motion.div variants={coverItem} className="no-print flex justify-center gap-1.5 mt-10">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-accent"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── Rooms ─────────────────────────────────────────────── */}
        <motion.div
          variants={roomsVariants}
          initial="hidden"
          animate="show"
        >
          {project.rooms.map((room, ri) => (
            <motion.div
              key={room.id}
              variants={roomVariant}
              className={ri < project.rooms.length - 1 ? 'print-page mb-14' : 'mb-14'}
            >
              {/* Room header */}
              <div className="flex items-center gap-3 mb-7 pb-4 border-b border-line">
                <motion.div
                  className="w-1 h-7 rounded-full bg-accent"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.35 + ri * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ originY: 0 }}
                />
                <div>
                  <h2 className="text-[20px] font-bold text-ink" style={{ letterSpacing: '-0.015em' }}>{room.name}</h2>
                  <p className="text-[12px] text-ink-3">{room.type}</p>
                </div>
                {/* Keypad count badge */}
                <div className="ml-auto no-print px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-ink-3 border border-line bg-raised">
                  {room.keypads.length} keypad{room.keypads.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Keypad grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
                variants={keypadsVariants}
                initial="hidden"
                animate="show"
              >
                {room.keypads.map(kp => {
                  const model = kp.modelId ? getModel(kp.modelId) : undefined;
                  const bodyColor = model && kp.selectedColorId
                    ? model.colors.find(c => c.id === kp.selectedColorId)?.hex
                    : undefined;
                  return (
                    <motion.div key={kp.id} variants={keypadVariant}>
                      <ClientKeypadCard
                        keypad={kp}
                        textCase={project.settings.textCase}
                        bodyHex={bodyColor}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>

              {room.notes && (
                <p className="mt-4 text-[12px] text-ink-2 italic">{room.notes}</p>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* ── Signature ─────────────────────────────────────────── */}
        <motion.div
          className="mt-16 pt-8 border-t border-line"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="grid grid-cols-2 gap-12">
            <div>
              <div className="h-14 border-b border-line-strong mb-2" />
              <p className="text-[11px] text-ink-3">Client Approval Signature</p>
              <p className="text-[11px] text-ink-3 mt-0.5">Date: ___________________</p>
            </div>
            <div>
              <div className="h-14 border-b border-line-strong mb-2" />
              <p className="text-[11px] text-ink-3">Prepared By — Beyond Alliance</p>
              <p className="text-[11px] text-ink-3 mt-0.5">{project.preparedBy || '___________________'}</p>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-ink-3">
            {project.projectCode} · Revision R{project.revision} · {project.date} · Confidential
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Keypad card ──────────────────────────────────────────────────────────────

function getLuminance(hex: string) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function shiftBrightness(hex: string, amount: number) {
  const h = hex.replace('#', '');
  const c = (s: number) => Math.min(255, Math.max(0, parseInt(h.slice(s, s + 2), 16) + amount)).toString(16).padStart(2, '0');
  return '#' + c(0) + c(2) + c(4);
}

function ClientKeypadCard({ keypad, textCase, bodyHex }: {
  keypad: {
    name: string; location: string; brand: string; model: string;
    buttonCount: number; quantity: number; notes: string;
    buttons: Array<{ id: string; position: number; label: string; engravingMode?: string; icon?: string }>;
  };
  textCase: 'uppercase' | 'titlecase';
  bodyHex?: string;
}) {
  const rows = keypad.buttonCount / 2;
  const grid = Array.from({ length: rows }, (_, r) => keypad.buttons.slice(r * 2, r * 2 + 2));

  const fmt = (s: string) =>
    textCase === 'uppercase'
      ? s.toUpperCase()
      : s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

  const dark       = bodyHex ? getLuminance(bodyHex) < 0.45 : false;
  const printColor = bodyHex ? (dark ? '#f5f5f7' : '#1d1d1f') : undefined;
  const headerBg   = bodyHex ? shiftBrightness(bodyHex, dark ? 12 : -8) : undefined;
  const btnBg      = bodyHex ? (dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)') : undefined;

  return (
    <div
      className="rounded-xl border border-line overflow-hidden"
      style={bodyHex
        ? { backgroundColor: bodyHex, borderColor: shiftBrightness(bodyHex, dark ? 30 : -20), boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }
        : { backgroundColor: 'var(--surface)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b"
        style={bodyHex
          ? { backgroundColor: headerBg, borderColor: dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)' }
          : { borderColor: 'var(--line)', backgroundColor: 'var(--raised)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold" style={{ color: printColor ?? 'var(--ink)' }}>
              {keypad.name || keypad.location}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: printColor ? (dark ? 'rgba(245,245,247,0.6)' : 'rgba(29,29,31,0.5)') : 'var(--ink-3)' }}>
              {[keypad.location, keypad.brand, keypad.model].filter(Boolean).join(' · ')}
            </p>
          </div>
          {keypad.quantity > 1 && (
            <span
              className="text-[10px] px-2 py-0.5 rounded font-medium"
              style={{ background: dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.07)', color: printColor ?? 'var(--ink-2)' }}
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
            gap: bodyHex ? '2px' : '0',
            border: bodyHex ? 'none' : '1px solid var(--line)',
            borderRadius: '8px',
          }}
        >
          {grid.map(row =>
            row.map(btn => (
              <div
                key={btn.id}
                className="flex items-center justify-center min-h-[52px] px-2 relative"
                style={{
                  backgroundColor: btnBg ?? 'var(--raised)',
                  borderColor: 'var(--line)',
                  borderWidth: bodyHex ? 0 : '1px',
                  borderStyle: 'solid',
                }}
              >
                <span
                  className="text-[11px] font-bold tracking-wider text-center leading-tight"
                  style={{ color: printColor ?? 'var(--ink)' }}
                >
                  {btn.label ? fmt(btn.label) : <span style={{ opacity: 0.25 }}>—</span>}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Shine overlay (decorative, no-print) */}
      {bodyHex && (
        <div
          className="no-print"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%)',
            pointerEvents: 'none',
            borderRadius: '12px',
          }}
        />
      )}
    </div>
  );
}
