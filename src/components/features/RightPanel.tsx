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

  const TABS: { id: Tab; Icon: typeof Layers; label: string }[] = [
    { id: 'library',    Icon: Layers,            label: 'Library' },
    { id: 'properties', Icon: SlidersHorizontal, label: 'Properties' },
    { id: 'finish',     Icon: Palette,           label: 'Finish' },
  ];

  return (
    <div className="hidden md:flex w-[256px] min-w-[256px] flex-col h-full bg-panel border-l border-line">
      {/* Tab bar */}
      <div className="flex border-b border-line px-2 pt-1">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={[
              'flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold uppercase tracking-wider transition-colors rounded-t-lg',
              tab === t.id
                ? 'text-accent border-b-2 border-accent'
                : 'text-ink-3 border-b-2 border-transparent hover:text-ink-2',
            ].join(' ')}
          >
            <t.Icon size={13} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        {tab === 'library'    && <SceneLibrary />}
        {tab === 'properties' && <ButtonProperties />}
        {tab === 'finish'     && <KeypadColorPanel />}
      </div>
    </div>
  );
}
