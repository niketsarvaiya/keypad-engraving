import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  width?: string;
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, subtitle, children, width = 'max-w-lg', footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={clsx('relative w-full card-elevated shadow-2xl flex flex-col max-h-[90vh]', width)}>
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[rgba(255,255,255,0.06)]">
          <div>
            <h2 className="text-[15px] font-semibold text-[#f0f1f3]">{title}</h2>
            {subtitle && <p className="text-[12px] text-[#8b8fa8] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.06)] text-[#565a72] hover:text-[#f0f1f3] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
