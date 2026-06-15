import { clsx } from 'clsx';
import type { ProjectStatus } from '../../types';

const STATUS_MAP: Record<ProjectStatus, { label: string; cls: string }> = {
  'draft':               { label: 'Draft',               cls: 'bg-[var(--raised)] text-ink-2 border-line' },
  'shared-with-client':  { label: 'Shared with Client',  cls: 'bg-[var(--info-dim)] text-[#3b82f6] border-[rgba(59,130,246,0.2)]' },
  'changes-requested':   { label: 'Changes Requested',   cls: 'bg-[var(--warn-dim)] text-[#f59e0b] border-[rgba(245,158,11,0.2)]' },
  'approved':            { label: 'Approved',            cls: 'bg-[var(--ok-dim)] text-[#10b981] border-[rgba(16,185,129,0.2)]' },
  'sent-for-engraving':  { label: 'Sent for Engraving',  cls: 'bg-[var(--accent-dim)] text-accent border-[rgba(99,102,241,0.2)]' },
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const { label, cls } = STATUS_MAP[status];
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border', cls)}>
      {label}
    </span>
  );
}

export function RevisionBadge({ revision }: { revision: number }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-raised text-ink-2 border border-line">
      R{revision}
    </span>
  );
}
