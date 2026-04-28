import type { EngravingProject } from '../types';

const KEY = 'engraving_projects';

export function loadProjects(): EngravingProject[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as EngravingProject[]) : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: EngravingProject[]): void {
  localStorage.setItem(KEY, JSON.stringify(projects));
}

export function saveProject(project: EngravingProject): void {
  const all = loadProjects();
  const idx = all.findIndex(p => p.id === project.id);
  if (idx >= 0) all[idx] = project;
  else all.unshift(project);
  saveProjects(all);
}

export function deleteProjectById(id: string): void {
  saveProjects(loadProjects().filter(p => p.id !== id));
}
