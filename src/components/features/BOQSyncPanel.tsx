import { useState, useEffect, useRef } from 'react';
import { RefreshCw, X, AlertTriangle, Plus, Minus, ArrowRightLeft, ExternalLink } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { BOQProject, BOQChange } from '../../types';

const BOQ_ORIGINS = [
  'https://boq-builder-cyan.vercel.app',
  'http://localhost:5175',
];
const BOQ_URL = 'https://boq-builder-cyan.vercel.app';

const CHANGE_STYLES: Record<string, { bg: string; border: string; text: string; icon: typeof Plus }> = {
  added:         { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)',  text: '#10b981', icon: Plus },
  removed:       { bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.2)',   text: '#ef4444', icon: Minus },
  'count-changed': { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', text: '#f59e0b', icon: ArrowRightLeft },
};

interface Props {
  projectId: string;
}

export function BOQSyncBanner({ projectId }: Props) {
  const { boqChanges, syncFromBOQ, dismissChanges } = useStore();
  const [syncing, setSyncing] = useState(false);
  const popupRef = useRef<Window | null>(null);
  const project = useStore(s => s.projects.find(p => p.id === projectId));

  // Listen for postMessage from BOQ builder
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!BOQ_ORIGINS.includes(e.origin)) return;
      if (e.data?.type === 'boq-sync' && e.data?.boqProject) {
        syncFromBOQ(e.data.boqProject as BOQProject, projectId);
        setSyncing(false);
        popupRef.current?.close();
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [projectId, syncFromBOQ]);

  const openBOQSync = () => {
    setSyncing(true);
    const callbackOrigin = encodeURIComponent(window.location.origin);
    const url = project?.boqProjectId
      ? `${BOQ_URL}?sync-request=${project.boqProjectId}&callback=${callbackOrigin}`
      : `${BOQ_URL}?callback=${callbackOrigin}`;
    popupRef.current = window.open(url, 'boq-sync', 'width=1200,height=800,left=100,top=100');

    // Fallback: close loading state after 30s if no response
    setTimeout(() => setSyncing(false), 30000);
  };

  if (boqChanges.length === 0) {
    return (
      <div className="flex items-center justify-between px-4 py-2.5 bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.04)]">
        <p className="text-[11px] text-[#565a72]">
          {project?.boqSnapshot
            ? `Last synced ${new Date(project.boqSnapshot.snapshotDate).toLocaleDateString()}`
            : 'Not synced with BOQ'}
        </p>
        <button
          onClick={openBOQSync}
          disabled={syncing}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-[rgba(255,255,255,0.08)] text-[#8b8fa8] hover:text-[#6366f1] hover:border-[rgba(99,102,241,0.3)] transition-all disabled:opacity-50"
        >
          <RefreshCw size={11} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Opening BOQ…' : 'Sync from BOQ'}
          <ExternalLink size={10} className="opacity-60" />
        </button>
      </div>
    );
  }

  return (
    <div className="border-b border-[rgba(255,255,255,0.06)]">
      <div className="px-4 py-2 flex items-center justify-between bg-[rgba(245,158,11,0.05)]">
        <div className="flex items-center gap-2">
          <AlertTriangle size={13} className="text-[#f59e0b] shrink-0" />
          <p className="text-[12px] font-medium text-[#f59e0b]">
            {boqChanges.length} BOQ change{boqChanges.length > 1 ? 's' : ''} detected
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openBOQSync}
            disabled={syncing}
            className="flex items-center gap-1 text-[11px] text-[#8b8fa8] hover:text-[#f0f1f3] transition-colors"
          >
            <RefreshCw size={10} className={syncing ? 'animate-spin' : ''} />
            Re-sync
          </button>
          <button onClick={dismissChanges} className="text-[#565a72] hover:text-[#f0f1f3] transition-colors">
            <X size={13} />
          </button>
        </div>
      </div>

      <div className="px-4 py-2 flex flex-wrap gap-2">
        {boqChanges.slice(0, 6).map((c, i) => (
          <ChangeChip key={i} change={c} />
        ))}
        {boqChanges.length > 6 && (
          <span className="text-[11px] text-[#565a72] self-center">+{boqChanges.length - 6} more</span>
        )}
      </div>
    </div>
  );
}

function ChangeChip({ change }: { change: BOQChange }) {
  const style = CHANGE_STYLES[change.type] ?? CHANGE_STYLES['count-changed'];
  const Icon = style.icon;

  const label = change.type === 'count-changed'
    ? `${change.roomName}: BOQ ${change.boqQty} / Project ${change.projectQty}`
    : change.type === 'added'
    ? `${change.roomName} (new in BOQ)`
    : `${change.roomName} (removed from BOQ)`;

  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium border"
      style={{ backgroundColor: style.bg, borderColor: style.border, color: style.text }}
    >
      <Icon size={10} />
      {label}
    </div>
  );
}
