import type { TextCase } from '../types';

const MAX_SAFE = 12;
const MAX_HARD = 16;

export interface LabelValidation {
  ok: boolean;
  warning: string | null;
  error: string | null;
}

export function validateLabel(label: string): LabelValidation {
  const len = label.trim().length;
  if (len === 0) return { ok: true, warning: null, error: null };
  if (len > MAX_HARD) return { ok: false, warning: null, error: `Too long (${len} chars, max ${MAX_HARD})` };
  if (len > MAX_SAFE) return { ok: true, warning: `Long label (${len} chars) — may be tight`, error: null };
  return { ok: true, warning: null, error: null };
}

export function formatLabel(label: string, textCase: TextCase): string {
  if (!label.trim()) return label;
  return textCase === 'uppercase'
    ? label.toUpperCase()
    : label.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

export function isEngravingSafe(label: string): boolean {
  return label.trim().length <= MAX_SAFE;
}
