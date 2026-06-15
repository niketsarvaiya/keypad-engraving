import { useState } from 'react';
import { ArrowLeft, Download, Eye, ChevronDown, FileSpreadsheet, Printer, Settings, Menu, LayoutPanelLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { StatusBadge, RevisionBadge } from '../ui/Badge';
import { exportToExcel } from '../../lib/exportExcel';
import { ProjectSetupModal } from '../features/ProjectSetupModal';
import { ThemeToggle } from '../ui/ThemeToggle';
import type { ProjectStatus } from '../../types';

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'draft',               label: 'Draft' },
  { value: 'shared-with-client',  label: 'Shared with Client' },
  { value: 'changes-requested',   label: 'Changes Requested' },
  { value: 'approved',            label: 'Approved' },
  { value: 'sent-for-engraving',  label: 'Sent for Engraving' },
];

interface Props { onMenuClick?: () => void; }

export function TopBar({ onMenuClick }: Props) {
  const { activeProject, activeProjectId, closeProject, setStatus, setView } = useStore();
  const project = activeProject();
  const [showExport, setShowExport] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (!project || !activeProjectId) return null;

  const handleExcelExport = () => { setShowExport(false); exportToExcel(project); };
  const handlePrint = () => { setShowExport(false); setView('client-view'); setTimeout(() => window.print(), 400); };

  return (
    <>
      <div className="h-[52px] min-h-[52px] flex items-center px-4 gap-3 bg-surface border-b border-line no-print">
        {/* Mobile menu */}
        {onMenuClick && (
          <button onClick={onMenuClick} className="md:hidden icon-btn">
            <Menu size={16} />
          </button>
        )}

        {/* Brand mark */}
        <div className="hidden md:flex items-center gap-2 mr-1">
          <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
            <LayoutPanelLeft size={12} className="text-white" />
          </div>
        </div>

        {/* Back */}
        <button onClick={closeProject} className="icon-btn" title="All projects">
          <ArrowLeft size={16} />
        </button>

        <div className="w-px h-5 bg-line" />

        {/* Project info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[14px] font-semibold text-ink truncate" style={{ letterSpacing: '-0.01em' }}>
              {project.name}
            </h1>
            <RevisionBadge revision={project.revision} />
          </div>
          <p className="text-[11px] text-ink-3 truncate">{project.client} · {project.projectCode}</p>
        </div>

        {/* Status selector */}
        <div className="relative">
          <button
            onClick={() => { setShowStatus(!showStatus); setShowExport(false); }}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <StatusBadge status={project.status} />
            <ChevronDown size={11} className="text-ink-3" />
          </button>
          {showStatus && (
            <div className="absolute right-0 top-full mt-1.5 w-52 card-elevated shadow-xl z-30 py-1 overflow-hidden">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setStatus(activeProjectId, opt.value); setShowStatus(false); }}
                  className="w-full text-left px-3.5 py-2.5 text-[12px] text-ink-2 hover:bg-raised hover:text-ink transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-line" />

        {/* Theme toggle — desktop */}
        <div className="hidden md:block">
          <ThemeToggle />
        </div>

        <div className="w-px h-5 bg-line hidden md:block" />

        {/* Client view */}
        <button
          onClick={() => setView('client-view')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-raised text-ink-2 hover:text-ink transition-colors text-[12px] font-medium"
        >
          <Eye size={14} />
          <span className="hidden md:inline">Client View</span>
        </button>

        {/* Settings */}
        <button onClick={() => setShowSettings(true)} className="icon-btn" title="Project settings">
          <Settings size={15} />
        </button>

        {/* Export */}
        <div className="relative">
          <button
            onClick={() => { setShowExport(!showExport); setShowStatus(false); }}
            className="btn-primary text-[12px] py-1.5 px-3"
          >
            <Download size={13} />
            Export
            <ChevronDown size={11} />
          </button>
          {showExport && (
            <div className="absolute right-0 top-full mt-1.5 w-48 card-elevated shadow-xl z-30 py-1 overflow-hidden">
              <button onClick={handlePrint}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] text-ink-2 hover:bg-raised hover:text-ink transition-colors">
                <Printer size={13} /> Print / PDF
              </button>
              <button onClick={handleExcelExport}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] text-ink-2 hover:bg-raised hover:text-ink transition-colors">
                <FileSpreadsheet size={13} /> Excel / CSV
              </button>
            </div>
          )}
        </div>
      </div>

      <ProjectSetupModal projectId={activeProjectId} open={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
