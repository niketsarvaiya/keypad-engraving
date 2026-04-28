import { useState, useRef } from 'react';
import { Plus, LayoutGrid, Trash2, Upload, FileJson, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { StatusBadge, RevisionBadge } from '../components/ui/Badge';
import { NewProjectModal } from '../components/features/ProjectSetupModal';
import { importFromBOQ } from '../lib/boqImport';
import { createDemoProject } from '../lib/defaults';
import type { BOQProject } from '../types';

export function ProjectsPage() {
  const { projects, openProject, removeProject, createProject } = useStore();
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
    <div className="min-h-screen bg-[#0a0b0f] flex flex-col">
      {/* Header */}
      <div className="border-b border-[rgba(255,255,255,0.06)] bg-[#0f1117]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded bg-[#6366f1] flex items-center justify-center">
                <LayoutGrid size={13} className="text-white" />
              </div>
              <span className="text-[11px] font-medium text-[#565a72] uppercase tracking-widest">Beyond Finesse</span>
            </div>
            <h1 className="text-[22px] font-bold text-[#f0f1f3] tracking-tight">Keypad Engraving</h1>
            <p className="text-[13px] text-[#8b8fa8] mt-0.5">Design, review, and export keypad engraving layouts</p>
          </div>
          <div className="flex items-center gap-2">
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleBOQImport} />
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.06)] text-[#8b8fa8] hover:text-[#f0f1f3] text-[13px] font-medium transition-colors"
            >
              <Upload size={14} />
              Import BOQ
            </button>
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f52e0] text-white text-[13px] font-medium transition-colors"
            >
              <Plus size={14} />
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 w-full flex-1">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.2)] flex items-center justify-center mb-5">
              <LayoutGrid size={28} className="text-[#6366f1]" />
            </div>
            <h2 className="text-[18px] font-semibold text-[#f0f1f3] mb-2">No projects yet</h2>
            <p className="text-[13px] text-[#8b8fa8] max-w-sm mb-8">
              Create a new project manually or import a BOQ JSON to auto-generate rooms and keypads.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={loadDemo}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.06)] text-[#8b8fa8] hover:text-[#f0f1f3] text-[13px] font-medium transition-colors"
              >
                <Zap size={14} />
                Load Demo
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.06)] text-[#8b8fa8] hover:text-[#f0f1f3] text-[13px] font-medium transition-colors"
              >
                <FileJson size={14} />
                Import BOQ JSON
              </button>
              <button
                onClick={() => setShowNewModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#6366f1] hover:bg-[#4f52e0] text-white text-[13px] font-medium transition-colors"
              >
                <Plus size={14} />
                New Project
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-[13px] text-[#8b8fa8]">
                {projects.length} project{projects.length > 1 ? 's' : ''}
              </p>
              <button
                onClick={loadDemo}
                className="flex items-center gap-1.5 text-[12px] text-[#565a72] hover:text-[#8b8fa8] transition-colors"
              >
                <Zap size={12} /> Load demo
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <ProjectCard
                    project={project}
                    onOpen={() => openProject(project.id)}
                    onDelete={() => removeProject(project.id)}
                  />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      <NewProjectModal
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        onCreate={openProject}
      />
    </div>
  );
}

function ProjectCard({
  project,
  onOpen,
  onDelete,
}: {
  project: ReturnType<typeof useStore.getState>['projects'][0];
  onOpen: () => void;
  onDelete: () => void;
}) {
  const totalKeypads = project.rooms.reduce((a, r) => a + r.keypads.length, 0);
  const totalButtons = project.rooms.reduce(
    (a, r) => a + r.keypads.reduce((b, k) => b + k.buttons.filter(btn => btn.label).length, 0),
    0
  );

  return (
    <div
      className="card hover:border-[rgba(255,255,255,0.1)] transition-all cursor-pointer group"
      onClick={onOpen}
    >
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-lg bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.15)] flex items-center justify-center">
            <LayoutGrid size={16} className="text-[#6366f1]" />
          </div>
          <div className="flex items-center gap-1.5">
            <RevisionBadge revision={project.revision} />
            <button
              onClick={e => { e.stopPropagation(); onDelete(); }}
              className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-[rgba(239,68,68,0.1)] text-[#565a72] hover:text-[#ef4444] transition-all"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Info */}
        <h3 className="text-[14px] font-semibold text-[#f0f1f3] mb-0.5 truncate">{project.name}</h3>
        <p className="text-[12px] text-[#565a72] truncate mb-3">{project.client || 'No client'} · {project.projectCode || 'No code'}</p>

        <StatusBadge status={project.status} />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
          {[
            { label: 'Rooms', value: project.rooms.length },
            { label: 'Keypads', value: totalKeypads },
            { label: 'Labels', value: totalButtons },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-[16px] font-bold text-[#f0f1f3]">{s.value}</p>
              <p className="text-[10px] text-[#565a72] uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
