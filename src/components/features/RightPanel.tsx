import { useState, useEffect } from 'react';
import { Layers, SlidersHorizontal, Palette } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SceneLibrary } from './SceneLibrary';
import { ButtonProperties } from './ButtonProperties';
import { KeypadColorPanel } from './KeypadColorPanel';

type Tab = 'library' | 'properties' | 'finish';

export function RightPanel() {
  const { activeButtonId } = useStore();
  const [tab, setTab] = useState<Tab>('library');

  useEffect(() => {
    if (activeButtonId) setTab('properties');
  }, [activeButtonId]);

  return (
    <div className="hidden md:flex w-[260px] min-w-[260px] flex-col h-full bg-[#0f1117] border-l border-[rgba(255,255,255,0.06)]">
      {/* Tab bar */}
      <div className="flex border-b border-[rgba(255,255,255,0.06)]">
        {([
          { id: 'library'    as Tab, icon: Layers,            label: 'Library' },
          { id: 'properties' as Tab, icon: SlidersHorizontal, label: 'Props' },
          { id: 'finish'     as Tab, icon: Palette,           label: 'Finish' },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1 py-3 text-[11px] font-medium transition-colors border-b-2 ${
              tab === t.id
                ? 'text-[#6366f1] border-[#6366f1]'
                : 'text-[#565a72] border-transparent hover:text-[#8b8fa8]'
            }`}
          >
            <t.icon size={12} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {tab === 'library'    && <SceneLibrary />}
        {tab === 'properties' && <ButtonProperties />}
        {tab === 'finish'     && <KeypadColorPanel />}
      </div>
    </div>
  );
}
