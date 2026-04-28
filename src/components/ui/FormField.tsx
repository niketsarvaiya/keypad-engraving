import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
}

export function FormField({ label, required, children, hint }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="label">
        {label}
        {required && <span className="text-[#ef4444] ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-[#565a72]">{hint}</p>}
    </div>
  );
}

interface Btn {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export function Btn({ label, variant = 'secondary', onClick, type = 'button', disabled }: Btn) {
  const cls = {
    primary:   'bg-[#6366f1] hover:bg-[#4f52e0] text-white',
    secondary: 'bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] text-[#f0f1f3] border border-[rgba(255,255,255,0.08)]',
    ghost:     'hover:bg-[rgba(255,255,255,0.06)] text-[#8b8fa8] hover:text-[#f0f1f3]',
    danger:    'bg-[rgba(239,68,68,0.12)] hover:bg-[rgba(239,68,68,0.2)] text-[#ef4444] border border-[rgba(239,68,68,0.2)]',
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${cls}`}
    >
      {label}
    </button>
  );
}
