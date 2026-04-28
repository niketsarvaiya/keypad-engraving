import { useState, useEffect } from 'react';
import { Plus, Search, ArrowLeft, Cpu, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRepositoryStore } from '../store/useRepositoryStore';
import { useStore } from '../store/useStore';
import { ModelCard } from '../components/repository/ModelCard';
import { ModelFormModal } from '../components/repository/ModelFormModal';

export function RepositoryPage() {
  const { models, deleteModel, hydrate } = useRepositoryStore();
  const { setView } = useStore();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | undefined>();

  useEffect(() => { hydrate(); }, [hydrate]);

  const filtered = models.filter(m =>
    [m.brand, m.modelNumber, m.name].some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const openEdit = (id: string) => { setEditId(id); setShowForm(true); };
  const openNew = () => { setEditId(undefined); setShowForm(true); };

  return (
    <div className="min-h-screen bg-[#0a0b0f] flex flex-col">
      {/* Header */}
      <div className="border-b border-[rgba(255,255,255,0.06)] bg-[#0f1117]">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-5">
          <div className="flex items-center gap-3 mb-1">
            <button onClick={() => setView('projects')}
              className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.06)] text-[#565a72] hover:text-[#f0f1f3] transition-colors">
              <ArrowLeft size={16} />
            </button>
            <div className="w-px h-5 bg-[rgba(255,255,255,0.06)]" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#6366f1] flex items-center justify-center">
                <Database size={13} className="text-white" />
              </div>
              <span className="text-[11px] font-medium text-[#565a72] uppercase tracking-widest">Beyond Finesse</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-[20px] md:text-[22px] font-bold text-[#f0f1f3] tracking-tight">Keypad Repository</h1>
              <p className="text-[12px] md:text-[13px] text-[#8b8fa8] mt-0.5">Global model database — colors, layouts, properties</p>
            </div>
            <button onClick={openNew}
              className="flex items-center gap-2 px-3 md:px-3.5 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f52e0] text-white text-[12px] md:text-[13px] font-medium transition-colors shrink-0">
              <Plus size={14} />
              <span className="hidden sm:inline">Add Model</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-5 w-full">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#565a72]" />
          <input
            className="input-field pl-9"
            placeholder="Search brand, model number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-5 w-full flex-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.2)] flex items-center justify-center mb-4">
              <Cpu size={26} className="text-[#6366f1]" />
            </div>
            <h2 className="text-[16px] font-semibold text-[#f0f1f3] mb-1">
              {search ? 'No models found' : 'No models yet'}
            </h2>
            <p className="text-[13px] text-[#8b8fa8] max-w-xs mb-6">
              {search ? 'Try a different search.' : 'Add keypad models with colors, layouts, and engraving specs.'}
            </p>
            {!search && (
              <button onClick={openNew}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#6366f1] hover:bg-[#4f52e0] text-white text-[13px] font-medium transition-colors">
                <Plus size={14} /> Add First Model
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-[12px] text-[#565a72] mb-4">{filtered.length} model{filtered.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {filtered.map((model, i) => (
                <motion.div key={model.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <ModelCard model={model} onEdit={() => openEdit(model.id)} onDelete={() => deleteModel(model.id)} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      <ModelFormModal open={showForm} onClose={() => setShowForm(false)} editId={editId} />
    </div>
  );
}
