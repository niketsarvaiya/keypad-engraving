import type { KeypadModel } from '../types';

const KEY = 'engraving_repository';

export function loadModels(): KeypadModel[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as KeypadModel[]) : [];
  } catch { return []; }
}

export function saveModels(models: KeypadModel[]): void {
  localStorage.setItem(KEY, JSON.stringify(models));
}

export function saveModel(model: KeypadModel): void {
  const all = loadModels();
  const idx = all.findIndex(m => m.id === model.id);
  if (idx >= 0) all[idx] = model; else all.unshift(model);
  saveModels(all);
}

export function deleteModelById(id: string): void {
  saveModels(loadModels().filter(m => m.id !== id));
}
