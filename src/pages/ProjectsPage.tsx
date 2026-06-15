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
      <header className="sticky top-0 z-20 bg-surface border-b border-line">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <LayoutPanelLeft size={14} className="text-white" />
            </div>
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
            <button onClick={() => setShowNewModal(true)} className="btn-primary text-[12px] py-1.5 px-3.5">
              <Plus size={13} />New Project
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-accent mb-3">Keypad Engraving</p>
          <h1 className="text-[32px] font-bold text-ink leading-tight mb-2" style={{ letterSpacing: '-0.022em' }}>
            {projects.length === 0 ? 'Start your first project' : `${projects.length} project${projects.length > 1 ? 's' : ''}`}
          </h1>
          <p className="text-[15px] text-ink-2 leading-relaxed max-w-lg">
            Design keypad engraving layouts, collaborate with clients, and export factory-ready files.
          </p>
        </motion.div>
      </div>

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
                <button onClick={loadDemo} className="flex items-center gap-1.5 text-[12px] text-ink-3 hover:text-accent transition-colors">
                  <Zap size={12} />Load demo
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project, i) => (
                  <motion.div key={project.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }}>
                    <ProjectCard project={project} onOpen={() => openProject(project.id)} onDelete={() => removeProject(project.id)} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <NewProjectModal open={showNewModal} onClose={() => setShowNewModal(false)} onCreate={openProject} />
    </div>
  );
}

function EmptyState({ onNew, onImport, onDemo }: { onNew: () => void; onImport: () => void; onDemo: () => void }) {
  return (
    <div className="mt-4">
      <div className="rounded-2xl border border-line bg-surface overflow-hidden mb-8" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div className="h-52 bg-raised flex items-center justify-center gap-5 border-b border-line px-8">
          {[
            { color: '#3d2f28', btns: ['LIGHTS', 'AMBIENT', 'CURTAINS', 'ALL OFF'] },
            { color: '#2c2c2e', btns: ['SLEEP', 'READING', 'AC', 'ALL OFF'] },
            { color: '#f0eeea', btns: ['BRIGHT', 'RELAX', 'MUSIC', 'ALL OFF'] },
          ].map((kp, ki) => {
            const r2 = parseInt(kp.color.slice(1,3),16), g2 = parseInt(kp.color.slice(3,5),16), b2 = parseInt(kp.color.slice(5,7),16);
            const isLight = r2*0.299 + g2*0.587 + b2*0.114 > 128;
            return (
              <motion.div key={ki} initial={{ opacity: 0, scale: 0.88, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.1 + ki * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="rounded-xl overflow-hidden shrink-0"
                style={{ backgroundColor: kp.color, width: 112, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                <div className="p-1.5 grid grid-cols-2 gap-1">
                  {kp.btns.map((label, bi) => (
                    <div key={bi} className="rounded-md h-11 flex items-center justify-center px-1 text-center"
                      style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)' }}>
                      <span className="text-[7px] font-bold tracking-wider leading-tight"
                        style={{ color: isLight ? '#1d1d1f' : '#f5f5f7' }}>{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h2 className="text-[18px] font-semibold text-ink mb-1.5" style={{ letterSpacing: '-0.015em' }}>No projects yet</h2>
            <p className="text-[13px] text-ink-2 leading-relaxed max-w-sm">
              Create a project, add rooms and keypads, assign labels and icons, then export for the factory.
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
            <button onClick={onNew} className="btn-primary justify-center"><Plus size={14} />New Project</button>
            <button onClick={onDemo} className="btn-ghost justify-center text-[12px]"><Zap size={13} />Load demo</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { Icon: LayoutGrid, title: 'Room-by-room layout', body: 'Organise keypads by room. Each card shows exactly how the device will be engraved.' },
          { Icon: FileJson, title: 'Import from BOQ', body: 'Drop a BOQ JSON from Beyond Quote Builder and rooms are created automatically.', action: { label: 'Import BOQ', fn: onImport } },
          { Icon: Database, title: 'Keypad repository', body: 'Add keypad models once. Reuse colours and layouts across every project.' },
        ].map(({ Icon, title, body, action }) => (
          <div key={title} className="p-5 rounded-xl border border-line bg-surface">
            <div className="w-9 h-9 rounded-xl bg-accent-dim flex items-center justify-center mb-4">
              <Icon size={16} className="text-accent" />
            </div>
            <p className="text-[13px] font-semibold text-ink mb-1.5">{title}</p>
            <p className="text-[12px] text-ink-2 leading-relaxed">{body}</p>
            {action && <button onClick={action.fn} className="mt-3 text-[12px] font-medium text-accent hover:opacity-70 transition-opacity">{action.label} →</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, onOpen, onDelete }: {
  project: ReturnType<typeof useStore.getState>['projects'][0];
  onOpen: () => void; onDelete: () => void;
}) {
  const totalKeypads = project.rooms.reduce((a, r) => a + r.keypads.length, 0);
  const totalLabels = project.rooms.reduce((a, r) => a + r.keypads.reduce((b, k) => b + k.buttons.filter(btn => btn.label).length, 0), 0);

  return (
    <div onClick={onOpen} className="group card p-5 cursor-pointer hover:border-line-strong transition-all duration-200"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-accent-dim flex items-center justify-center">
          <LayoutPanelLeft size={17} className="text-accent" />
        </div>
        <div className="flex items-center gap-2">
          <RevisionBadge revision={project.revision} />
          <button onClick={e => { e.stopPropagation(); onDelete(); }}
            className="opacity-0 group-hover:opacity-100 icon-btn w-7 h-7 hover:bg-[rgba(239,68,68,0.08)] hover:text-[#ef4444] transition-all">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <h3 className="text-[15px] font-semibold text-ink mb-0.5 truncate" style={{ letterSpacing: '-0.012em' }}>{project.name}</h3>
      <p className="text-[12px] text-ink-2 truncate mb-4">{project.client || 'No client'} · {project.projectCode || 'No code'}</p>
      <StatusBadge status={project.status} />
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-line">
        {[{ label: 'Rooms', value: project.rooms.length }, { label: 'Keypads', value: totalKeypads }, { label: 'Labels', value: totalLabels }].map(s => (
          <div key={s.label} className="text-center">
            <p className="text-[20px] font-bold text-ink" style={{ letterSpacing: '-0.025em' }}>{s.value}</p>
            <p className="text-[10px] font-medium text-ink-3 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
