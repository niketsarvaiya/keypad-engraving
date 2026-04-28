import { useState, useEffect } from 'react';
import { Layers, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SceneLibrary } from './SceneLibrary';
import { ButtonProperties } from './ButtonProperties';

export function RightPanel() {
  const { activeButtonId } = useStore();
  const [tab, setTab] = useState<'library' | 'properties'>('library');

  // Auto-switch to Properties when a button is selected
  useEffect(() => {
    if (activeButtonId) setTab('properties');
  }, [activeButtonId]);

  const effectiveTab = activeButtonId ? tab : 'library';

  return (
    <div className="w-[260px] min-w-[260px] flex flex-col h-full bg-[#0f1117] border-l border-[rgba(255,255,255,0.06)]">
      {/* Tab bar */}
      <div className="flex border-b border-[rgba(255,255,255,0.06)]">
        {[
          { id: 'library' as const,    icon: Layers,            label: 'Library' },
          { id: 'properties' as const, icon: SlidersHorizontal, label: 'Properties' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[12px] font-medium transition-colors border-b-2 ${
              effectiveTab === t.id
                ? 'text-[#6366f1] border-[#6366f1]'
                : 'text-[#565a72] border-transparent hover:text-[#8b8fa8]'
            }`}
          >
            <t.icon size={13} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {effectiveTab === 'library' ? <SceneLibrary /> : <ButtonProperties />}
      </div>
    </div>
  );
}
