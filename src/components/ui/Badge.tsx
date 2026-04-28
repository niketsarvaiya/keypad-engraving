import { clsx } from 'clsx';
import type { ProjectStatus } from '../../types';

const STATUS_MAP: Record<ProjectStatus, { label: string; cls: string }> = {
  'draft':               { label: 'Draft',               cls: 'bg-[rgba(139,143,168,0.12)] text-[#8b8fa8] border-[rgba(139,143,168,0.2)]' },
  'shared-with-client':  { label: 'Shared with Client',  cls: 'bg-[rgba(59,130,246,0.12)] text-[#3b82f6] border-[rgba(59,130,246,0.2)]' },
  'changes-requested':   { label: 'Changes Requested',   cls: 'bg-[rgba(245,158,11,0.12)] text-[#f59e0b] border-[rgba(245,158,11,0.2)]' },
  'approved':            { label: 'Approved',            cls: 'bg-[rgba(16,185,129,0.12)] text-[#10b981] border-[rgba(16,185,129,0.2)]' },
  'sent-for-engraving':  { label: 'Sent for Engraving',  cls: 'bg-[rgba(99,102,241,0.12)] text-[#6366f1] border-[rgba(99,102,241,0.2)]' },
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
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[rgba(255,255,255,0.06)] text-[#8b8fa8] border border-[rgba(255,255,255,0.08)]">
      R{revision}
    </span>
  );
}
