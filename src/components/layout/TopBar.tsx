import { useState } from 'react';
import { ArrowLeft, Download, Eye, ChevronDown, FileSpreadsheet, Printer, Settings, Menu } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { StatusBadge, RevisionBadge } from '../ui/Badge';
import { exportToExcel } from '../../lib/exportExcel';
import { ProjectSetupModal } from '../features/ProjectSetupModal';
import type { ProjectStatus } from '../../types';

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'shared-with-client', label: 'Shared with Client' },
  { value: 'changes-requested', label: 'Changes Requested' },
  { value: 'approved', label: 'Approved' },
  { value: 'sent-for-engraving', label: 'Sent for Engraving' },
];

interface Props {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: Props) {
  const { activeProject, activeProjectId, closeProject, setStatus, setView } = useStore();
  const project = activeProject();

  const [showExport, setShowExport] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (!project || !activeProjectId) return null;

  const handleExcelExport = () => {
    setShowExport(false);
    exportToExcel(project);
  };

  const handlePrint = () => {
    setShowExport(false);
    setView('client-view');
    setTimeout(() => window.print(), 400);
  };

  return (
    <>
      <div className="h-[52px] min-h-[52px] flex items-center px-4 gap-3 bg-[#0f1117] border-b border-[rgba(255,255,255,0.06)] no-print">
        {/* Mobile hamburger */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.06)] text-[#565a72] hover:text-[#f0f1f3] transition-colors"
          >
            <Menu size={16} />
          </button>
        )}

        {/* Back */}
        <button
          onClick={closeProject}
          className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.06)] text-[#565a72] hover:text-[#f0f1f3] transition-colors"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="w-px h-5 bg-[rgba(255,255,255,0.06)]" />

        {/* Project info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[14px] font-semibold text-[#f0f1f3] truncate">{project.name}</h1>
            <RevisionBadge revision={project.revision} />
          </div>
          <p className="text-[11px] text-[#565a72] truncate">{project.client} · {project.projectCode}</p>
        </div>

        {/* Status selector */}
        <div className="relative">
          <button
            onClick={() => { setShowStatus(!showStatus); setShowExport(false); }}
            className="flex items-center gap-1.5"
          >
            <StatusBadge status={project.status} />
            <ChevronDown size={12} className="text-[#565a72]" />
          </button>
          {showStatus && (
            <div className="absolute right-0 top-full mt-1 w-48 card-elevated shadow-xl z-30 py-1">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setStatus(activeProjectId, opt.value); setShowStatus(false); }}
                  className="w-full text-left px-3 py-2 text-[12px] text-[#8b8fa8] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#f0f1f3] transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-[rgba(255,255,255,0.06)]" />

        {/* Client view */}
        <button
          onClick={() => setView('client-view')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.06)] text-[#8b8fa8] hover:text-[#f0f1f3] transition-colors text-[12px]"
        >
          <Eye size={14} />
          <span className="hidden md:inline">Client View</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => setShowSettings(true)}
          className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.06)] text-[#565a72] hover:text-[#f0f1f3] transition-colors"
          title="Project settings"
        >
          <Settings size={15} />
        </button>

        {/* Export */}
        <div className="relative">
          <button
            onClick={() => { setShowExport(!showExport); setShowStatus(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6366f1] hover:bg-[#4f52e0] text-white text-[12px] font-medium transition-colors"
          >
            <Download size={14} />
            Export
            <ChevronDown size={12} />
          </button>
          {showExport && (
            <div className="absolute right-0 top-full mt-1 w-44 card-elevated shadow-xl z-30 py-1">
              <button
                onClick={handlePrint}
                className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-[#8b8fa8] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#f0f1f3] transition-colors"
              >
                <Printer size={13} /> Print / PDF
              </button>
              <button
                onClick={handleExcelExport}
                className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-[#8b8fa8] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#f0f1f3] transition-colors"
              >
                <FileSpreadsheet size={13} /> Excel / CSV
              </button>
            </div>
          )}
        </div>
      </div>

      <ProjectSetupModal
        projectId={activeProjectId}
        open={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}
