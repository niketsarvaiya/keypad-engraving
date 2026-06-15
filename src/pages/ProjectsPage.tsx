import { useState, useRef } from 'react';
import { Plus, LayoutGrid, Trash2, Upload, FileJson, Zap, Database, ChevronRight, LayoutPanelLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { StatusBadge, RevisionBadge } from '../components/ui/Badge';
import { NewProjectModal } from '../components/features/ProjectSetupModal';
import { importFromBOQ } from '../lib/boqImport';
import { createDemoProject } from '../lib/defaults';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import type { BOQProject } from '../types';

// ─── Framer Motion variants ───────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const heroVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const heroLine = {
  hidden:  { opacity: 0, y: 14 },
  show:    { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const cardVariant = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.38, ease: EASE } },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export function ProjectsPage() {
  const { projects, openProject, removeProject, createProject, setView } = useStore();
  const [showNewModal, setShowNewModal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleBOQImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string) as BOQProject;
        const project = importFromBOQ(data);
        createProject(project);
        openProject(project.id);
      } catch {
        alert('Invalid BOQ JSON file. Please export from the BOQ Builder.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const loadDemo = () => {
    const p = createDemoProject();
    createProject(p);
    openProject(p.id);
  };

  return (
    <div className="min-h-screen bg-base flex flex-col">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-surface border-b border-line">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Animated logo mark */}
            <motion.div
              className="relative w-7 h-7 rounded-lg bg-accent flex items-center justify-center shrink-0 cursor-default"
              whileHover={{ scale: 1.1, rotate: -4 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            >
              <LayoutPanelLeft size={14} className="text-white relative z-10" />
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-lg bg-accent"
                animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              />
            </motion.div>
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-semibold text-ink tracking-tight">Beyond Finesse</span>
              <ChevronRight size={12} className="text-ink-3" />
              <span className="text-[13px] text-ink-2">Engraving</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="w-px h-5 bg-line mx-1" />
            <button onClick={() => setView('repository')} className="btn-ghost text-[12px] py-1.5 px-3">
              <Database size={13} /><span className="hidden sm:inline">Repository</span>
            </button>
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleBOQImport} />
            <button onClick={() => fileRef.current?.click()} className="btn-ghost text-[12px] py-1.5 px-3">
              <Upload size={13} /><span className="hidden sm:inline">Import BOQ</span>
            </button>
            <motion.button
              onClick={() => setShowNewModal(true)}
              className="btn-primary text-[12px] py-1.5 px-3.5"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
            >
              <Plus size={13} />New Project
            </motion.button>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8 w-full">
        <motion.div variants={heroVariants} initial="hidden" animate="show">
          <motion.p variants={heroLine} className="text-[11px] font-semibold uppercase tracking-[0.1em] text-accent mb-3">
            Keypad Engraving
          </motion.p>
          <motion.h1 variants={heroLine} className="text-[32px] font-bold text-ink leading-tight mb-2" style={{ letterSpacing: '-0.022em' }}>
            {projects.length === 0
              ? 'Start your first project'
              : `${projects.length} project${projects.length > 1 ? 's' : ''}`}
          </motion.h1>
          <motion.p variants={heroLine} className="text-[15px] text-ink-2 leading-relaxed max-w-lg">
            Design keypad engraving layouts, collaborate with clients, and export factory-ready files.
          </motion.p>
        </motion.div>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pb-20 w-full flex-1">
        <AnimatePresence mode="wait">
          {projects.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
              <EmptyState onNew={() => setShowNewModal(true)} onImport={() => fileRef.current?.click()} onDemo={loadDemo} />
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <p className="text-[13px] text-ink-3">
                  {projects.reduce((a, p) => a + p.rooms.length, 0)} rooms ·{' '}
                  {projects.reduce((a, p) => a + p.rooms.reduce((b, r) => b + r.keypads.length, 0), 0)} keypads
                </p>
                <motion.button
                  onClick={loadDemo}
                  className="flex items-center gap-1.5 text-[12px] text-ink-3 hover:text-accent transition-colors"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                >
                  <motion.span whileHover={{ rotate: 20 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <Zap size={12} />
                  </motion.span>
                  Load demo
                </motion.button>
              </div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                variants={gridVariants}
                initial="hidden"
                animate="show"
              >
                {projects.map(project => (
                  <motion.div key={project.id} variants={cardVariant} layout>
                    <ProjectCard project={project} onOpen={() => openProject(project.id)} onDelete={() => removeProject(project.id)} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <NewProjectModal open={showNewModal} onClose={() => setShowNewModal(false)} onCreate={openProject} />
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

const PREVIEW_KEYPADS = [
  {
    color: '#3d2f28',
    label: 'Basalte · Chime Brown',
    btns: ['LIGHTS', 'AMBIENT', 'CURTAINS', 'ALL OFF'],
  },
  {
    color: '#1c1c1e',
    label: 'Black Nova · Nero',
    btns: ['MOVIE', 'MUSIC', 'BRIGHT', 'ALL OFF'],
    featured: true,
  },
  {
    color: '#e8dcc8',
    label: 'EAE · Champagne',
    btns: ['SLEEP', 'READING', 'AC', 'ALL OFF'],
  },
];

function EmptyState({ onNew, onImport, onDemo }: { onNew: () => void; onImport: () => void; onDemo: () => void }) {
  const featureCards = [
    { Icon: LayoutGrid,   title: 'Room-by-room layout',  body: 'Organise keypads by room. Each card shows exactly how the device will be engraved.' },
    { Icon: FileJson,     title: 'Import from BOQ',      body: 'Drop a BOQ JSON from Beyond Quote Builder and rooms are created automatically.', action: { label: 'Import BOQ', fn: onImport } },
    { Icon: Database,     title: 'Keypad repository',    body: 'Add keypad models once. Reuse colours and layouts across every project.' },
  ];

  return (
    <div className="mt-4">
      {/* ── Preview card ───────────────────── */}
      <div className="rounded-2xl border border-line bg-surface overflow-hidden mb-8" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
        {/* Keypad showcase */}
        <div className="relative h-60 flex items-center justify-center gap-6 border-b border-line px-8 overflow-hidden"
          style={{ background: 'linear-gradient(180deg, var(--raised) 0%, var(--surface) 100%)' }}>

          {/* Dot grid */}
          <div className="absolute inset-0 dot-grid opacity-[0.055] pointer-events-none" />

          {/* Glow orb behind keypads */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-72 h-32 rounded-full animate-glow"
              style={{ background: 'radial-gradient(ellipse, var(--accent) 0%, transparent 70%)', filter: 'blur(36px)', opacity: 0.22 }}
            />
          </div>

          {PREVIEW_KEYPADS.map((kp, ki) => {
            const r = parseInt(kp.color.slice(1, 3), 16);
            const g = parseInt(kp.color.slice(3, 5), 16);
            const b = parseInt(kp.color.slice(5, 7), 16);
            const isLight = r * 0.299 + g * 0.587 + b * 0.114 > 128;
            const textColor = isLight ? '#1d1d1f' : '#f5f5f7';
            const btnBg    = isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.11)';
            const scale    = kp.featured ? 1.12 : 0.96;

            return (
              /* Entrance wrapper */
              <motion.div
                key={ki}
                initial={{ opacity: 0, scale: 0.82, y: 24 }}
                animate={{ opacity: 1, scale, y: 0 }}
                transition={{ delay: 0.12 + ki * 0.1, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* Float wrapper */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3.2 + ki * 0.4, repeat: Infinity, ease: 'easeInOut', delay: 0.9 + ki * 0.35 }}
                  className="relative"
                >
                  {/* Glow under featured keypad */}
                  {kp.featured && (
                    <div
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-28 h-6 opacity-50"
                      style={{ background: `radial-gradient(ellipse, ${kp.color} 0%, transparent 70%)`, filter: 'blur(8px)' }}
                    />
                  )}

                  <div
                    className="rounded-xl overflow-hidden shrink-0 relative"
                    style={{
                      backgroundColor: kp.color,
                      width: 112,
                      boxShadow: kp.featured
                        ? `0 16px 40px rgba(0,0,0,0.35), 0 0 0 1px ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'}`
                        : '0 8px 20px rgba(0,0,0,0.22)',
                    }}
                  >
                    {/* Keypad label */}
                    <div className="px-2 pt-2 pb-1">
                      <p className="text-[6px] font-semibold tracking-[0.08em] truncate" style={{ color: isLight ? 'rgba(0,0,0,0.38)' : 'rgba(255,255,255,0.35)' }}>
                        {kp.label.toUpperCase()}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="p-1.5 grid grid-cols-2 gap-1 pt-0">
                      {kp.btns.map((label, bi) => (
                        <div key={bi} className="rounded-md h-10 flex items-center justify-center px-1 text-center"
                          style={{ backgroundColor: btnBg }}>
                          <span className="text-[7px] font-bold tracking-wider leading-tight" style={{ color: textColor }}>
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Shine overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none rounded-xl"
                      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)' }}
                    />
                  </div>

                  {/* Brand dot */}
                  <div className="flex justify-center mt-2">
                    <div className="w-1 h-1 rounded-full bg-ink-3 opacity-30" />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA row */}
        <div className="px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h2 className="text-[18px] font-semibold text-ink mb-1.5" style={{ letterSpacing: '-0.015em' }}>No projects yet</h2>
            <p className="text-[13px] text-ink-2 leading-relaxed max-w-sm">
              Create a project, add rooms and keypads, assign labels and icons, then export for the factory.
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
            <motion.button onClick={onNew} className="btn-primary justify-center" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
              <Plus size={14} />New Project
            </motion.button>
            <motion.button onClick={onDemo} className="btn-ghost justify-center text-[12px]" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
              <Zap size={13} />Load demo
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Feature cards ──────────────────── */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } } }}
        initial="hidden"
        animate="show"
      >
        {featureCards.map(({ Icon, title, body, action }) => (
          <motion.div
            key={title}
            className="p-5 rounded-xl border border-line bg-surface group cursor-default"
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
            whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.07)' }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="w-9 h-9 rounded-xl bg-accent-dim flex items-center justify-center mb-4"
              whileHover={{ scale: 1.1, rotate: -6 }}
              transition={{ type: 'spring', stiffness: 350, damping: 18 }}
            >
              <Icon size={16} className="text-accent" />
            </motion.div>
            <p className="text-[13px] font-semibold text-ink mb-1.5">{title}</p>
            <p className="text-[12px] text-ink-2 leading-relaxed">{body}</p>
            {action && (
              <button onClick={action.fn} className="mt-3 text-[12px] font-medium text-accent hover:opacity-70 transition-opacity">
                {action.label} →
              </button>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────

function ProjectCard({ project, onOpen, onDelete }: {
  project: ReturnType<typeof useStore.getState>['projects'][0];
  onOpen: () => void;
  onDelete: () => void;
}) {
  const totalKeypads = project.rooms.reduce((a, r) => a + r.keypads.length, 0);
  const totalLabels  = project.rooms.reduce((a, r) => a + r.keypads.reduce((b, k) => b + k.buttons.filter(btn => btn.label).length, 0), 0);

  const stats = [
    { label: 'Rooms',   value: project.rooms.length },
    { label: 'Keypads', value: totalKeypads },
    { label: 'Labels',  value: totalLabels },
  ];

  return (
    <motion.div
      onClick={onOpen}
      className="group card p-5 cursor-pointer"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
      whileHover={{ y: -5, boxShadow: '0 18px 44px rgba(0,0,0,0.10)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div
          className="w-10 h-10 rounded-xl bg-accent-dim flex items-center justify-center"
          whileHover={{ scale: 1.08, rotate: -5 }}
          transition={{ type: 'spring', stiffness: 350, damping: 18 }}
        >
          <LayoutPanelLeft size={17} className="text-accent" />
        </motion.div>
        <div className="flex items-center gap-2">
          <span className="animate-badge-pop">
            <RevisionBadge revision={project.revision} />
          </span>
          <motion.button
            onClick={e => { e.stopPropagation(); onDelete(); }}
            className="opacity-0 group-hover:opacity-100 icon-btn w-7 h-7 hover:bg-[rgba(239,68,68,0.08)] hover:text-[#ef4444] transition-all"
            whileTap={{ scale: 0.88 }}
          >
            <Trash2 size={13} />
          </motion.button>
        </div>
      </div>

      <h3 className="text-[15px] font-semibold text-ink mb-0.5 truncate" style={{ letterSpacing: '-0.012em' }}>
        {project.name}
      </h3>
      <p className="text-[12px] text-ink-2 truncate mb-4">
        {project.client || 'No client'} · {project.projectCode || 'No code'}
      </p>

      <StatusBadge status={project.status} />

      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-line">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="text-center"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.04 }}
          >
            <p className="text-[20px] font-bold text-ink" style={{ letterSpacing: '-0.025em' }}>{s.value}</p>
            <p className="text-[10px] font-medium text-ink-3 uppercase tracking-wide">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
