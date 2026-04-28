import { create } from 'zustand';
import type {
  EngravingProject, EngravingRoom, Keypad, KeypadButton,
  ButtonComment, AppView, ProjectStatus, ButtonCount,
  MobilePanel, BOQProject, BOQChange,
} from '../types';
import { generateId, createDefaultButtons, DEFAULT_SETTINGS } from '../lib/defaults';
import { loadProjects, saveProject, deleteProjectById } from '../lib/storage';
import { buildSnapshot, computeChanges } from '../lib/boqDiff';

export type Theme = 'dark' | 'light' | 'system';

interface EngravingStore {
  // ── Theme ─────────────────────────────────────────────────────────
  theme: Theme;
  setTheme: (t: Theme) => void;

  // ── View ──────────────────────────────────────────────────────────
  view: AppView;
  setView: (v: AppView) => void;

  // ── Mobile ────────────────────────────────────────────────────────
  mobilePanel: MobilePanel;
  setMobilePanel: (p: MobilePanel) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;

  // ── BOQ Diff ──────────────────────────────────────────────────────
  boqChanges: BOQChange[];
  syncFromBOQ: (boq: BOQProject, projectId: string) => void;
  dismissChanges: () => void;

  // ── Projects ──────────────────────────────────────────────────────
  projects: EngravingProject[];
  hydrate: () => void;

  // ── Active selections ──────────────────────────────────────────────
  activeProjectId: string | null;
  activeRoomId: string | null;
  activeKeypadId: string | null;
  activeButtonId: string | null;

  openProject: (id: string) => void;
  closeProject: () => void;
  setActiveRoom: (id: string | null) => void;
  setActiveKeypad: (id: string | null) => void;
  setActiveButton: (id: string | null) => void;

  // ── Project CRUD ──────────────────────────────────────────────────
  createProject: (data: Partial<EngravingProject>) => string;
  updateProject: (id: string, data: Partial<EngravingProject>) => void;
  removeProject: (id: string) => void;
  setStatus: (id: string, status: ProjectStatus) => void;

  // ── Room CRUD ─────────────────────────────────────────────────────
  addRoom: (projectId: string, data: Omit<EngravingRoom, 'id' | 'keypads' | 'order'>) => string;
  updateRoom: (projectId: string, roomId: string, data: Partial<EngravingRoom>) => void;
  removeRoom: (projectId: string, roomId: string) => void;

  // ── Keypad CRUD ───────────────────────────────────────────────────
  addKeypad: (projectId: string, roomId: string, data: Omit<Keypad, 'id' | 'buttons'>) => string;
  updateKeypad: (projectId: string, roomId: string, keypadId: string, data: Partial<Keypad>) => void;
  removeKeypad: (projectId: string, roomId: string, keypadId: string) => void;
  changeButtonCount: (projectId: string, roomId: string, keypadId: string, count: ButtonCount) => void;

  // ── Button CRUD ───────────────────────────────────────────────────
  updateButton: (projectId: string, roomId: string, keypadId: string, buttonId: string, data: Partial<KeypadButton>) => void;

  // ── Comments ──────────────────────────────────────────────────────
  addComment: (projectId: string, roomId: string, keypadId: string, buttonId: string, data: Omit<ButtonComment, 'id' | 'createdAt'>) => void;
  resolveComment: (projectId: string, roomId: string, keypadId: string, buttonId: string, commentId: string) => void;

  // ── Selectors ─────────────────────────────────────────────────────
  activeProject: () => EngravingProject | null;
  activeRoom: () => EngravingRoom | null;
  activeKeypad: () => Keypad | null;
  activeButton: () => KeypadButton | null;
}

function mutateProject(
  projects: EngravingProject[],
  id: string,
  fn: (p: EngravingProject) => EngravingProject,
): EngravingProject[] {
  return projects.map(p => (p.id === id ? fn({ ...p, updatedAt: new Date().toISOString() }) : p));
}

export const useStore = create<EngravingStore>((set, get) => ({
  // ── Theme ─────────────────────────────────────────────────────────
  theme: (localStorage.getItem('theme') as Theme) ?? 'dark',
  setTheme: t => {
    localStorage.setItem('theme', t);
    set({ theme: t });
  },

  // ── View ──────────────────────────────────────────────────────────
  view: 'projects',
  setView: v => set({ view: v }),

  // ── Mobile ────────────────────────────────────────────────────────
  mobilePanel: 'editor',
  setMobilePanel: p => set({ mobilePanel: p }),
  sidebarOpen: false,
  setSidebarOpen: v => set({ sidebarOpen: v }),

  // ── BOQ Diff ──────────────────────────────────────────────────────
  boqChanges: [],
  syncFromBOQ: (boq, projectId) => {
    const snapshot = buildSnapshot(boq);
    const project = get().projects.find(p => p.id === projectId);
    if (!project) return;
    const changes = computeChanges(project, snapshot);
    const projects = get().projects.map(p =>
      p.id === projectId ? { ...p, boqSnapshot: snapshot, boqProjectId: boq.id } : p
    );
    set({ projects, boqChanges: changes });
    const updated = projects.find(p => p.id === projectId);
    if (updated) saveProject(updated);
  },
  dismissChanges: () => set({ boqChanges: [] }),

  // ── Projects ──────────────────────────────────────────────────────
  projects: [],
  hydrate: () => set({ projects: loadProjects() }),

  // ── Active selections ──────────────────────────────────────────────
  activeProjectId: null,
  activeRoomId: null,
  activeKeypadId: null,
  activeButtonId: null,

  openProject: id => {
    const project = get().projects.find(p => p.id === id);
    const firstRoomId = project?.rooms[0]?.id ?? null;
    const firstKeypadId = project?.rooms[0]?.keypads[0]?.id ?? null;
    set({ activeProjectId: id, activeRoomId: firstRoomId, activeKeypadId: firstKeypadId, activeButtonId: null, view: 'editor' });
  },

  closeProject: () => set({ activeProjectId: null, activeRoomId: null, activeKeypadId: null, activeButtonId: null, view: 'projects' }),

  setActiveRoom: id => set({ activeRoomId: id, activeKeypadId: null, activeButtonId: null }),
  setActiveKeypad: id => set({ activeKeypadId: id, activeButtonId: null }),
  setActiveButton: id => set({ activeButtonId: id }),

  // ── Project CRUD ──────────────────────────────────────────────────
  createProject: data => {
    const now = new Date().toISOString();
    const project: EngravingProject = {
      id: generateId(),
      name: data.name || 'New Project',
      client: data.client || '',
      projectCode: data.projectCode || '',
      preparedBy: data.preparedBy || '',
      date: data.date || now.slice(0, 10),
      revision: data.revision ?? 1,
      globalNotes: data.globalNotes || 'All keypads color Chime Brown & Printing White Color',
      settings: data.settings ?? { ...DEFAULT_SETTINGS },
      rooms: data.rooms ?? [],
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      ...data,
    };
    const projects = [project, ...get().projects];
    set({ projects });
    saveProject(project);
    return project.id;
  },

  updateProject: (id, data) => {
    const projects = mutateProject(get().projects, id, p => ({ ...p, ...data }));
    set({ projects });
    const updated = projects.find(p => p.id === id);
    if (updated) saveProject(updated);
  },

  removeProject: id => {
    set({ projects: get().projects.filter(p => p.id !== id) });
    deleteProjectById(id);
  },

  setStatus: (id, status) => {
    const projects = mutateProject(get().projects, id, p => ({ ...p, status }));
    set({ projects });
    const updated = projects.find(p => p.id === id);
    if (updated) saveProject(updated);
  },

  // ── Room CRUD ─────────────────────────────────────────────────────
  addRoom: (projectId, data) => {
    const roomId = generateId();
    const projects = mutateProject(get().projects, projectId, p => ({
      ...p,
      rooms: [...p.rooms, { ...data, id: roomId, keypads: [], order: p.rooms.length }],
    }));
    set({ projects, activeRoomId: roomId, activeKeypadId: null });
    const updated = projects.find(p => p.id === projectId);
    if (updated) saveProject(updated);
    return roomId;
  },

  updateRoom: (projectId, roomId, data) => {
    const projects = mutateProject(get().projects, projectId, p => ({
      ...p,
      rooms: p.rooms.map(r => (r.id === roomId ? { ...r, ...data } : r)),
    }));
    set({ projects });
    const updated = projects.find(p => p.id === projectId);
    if (updated) saveProject(updated);
  },

  removeRoom: (projectId, roomId) => {
    const projects = mutateProject(get().projects, projectId, p => ({
      ...p,
      rooms: p.rooms.filter(r => r.id !== roomId),
    }));
    const newActive = get().activeRoomId === roomId ? null : get().activeRoomId;
    set({ projects, activeRoomId: newActive });
    const updated = projects.find(p => p.id === projectId);
    if (updated) saveProject(updated);
  },

  // ── Keypad CRUD ───────────────────────────────────────────────────
  addKeypad: (projectId, roomId, data) => {
    const keypadId = generateId();
    const buttons = createDefaultButtons(data.buttonCount);
    const projects = mutateProject(get().projects, projectId, p => ({
      ...p,
      rooms: p.rooms.map(r =>
        r.id === roomId
          ? { ...r, keypads: [...r.keypads, { ...data, id: keypadId, buttons }] }
          : r,
      ),
    }));
    set({ projects, activeKeypadId: keypadId });
    const updated = projects.find(p => p.id === projectId);
    if (updated) saveProject(updated);
    return keypadId;
  },

  updateKeypad: (projectId, roomId, keypadId, data) => {
    const projects = mutateProject(get().projects, projectId, p => ({
      ...p,
      rooms: p.rooms.map(r =>
        r.id === roomId
          ? { ...r, keypads: r.keypads.map(k => (k.id === keypadId ? { ...k, ...data } : k)) }
          : r,
      ),
    }));
    set({ projects });
    const updated = projects.find(p => p.id === projectId);
    if (updated) saveProject(updated);
  },

  removeKeypad: (projectId, roomId, keypadId) => {
    const projects = mutateProject(get().projects, projectId, p => ({
      ...p,
      rooms: p.rooms.map(r =>
        r.id === roomId
          ? { ...r, keypads: r.keypads.filter(k => k.id !== keypadId) }
          : r,
      ),
    }));
    const newActive = get().activeKeypadId === keypadId ? null : get().activeKeypadId;
    set({ projects, activeKeypadId: newActive });
    const updated = projects.find(p => p.id === projectId);
    if (updated) saveProject(updated);
  },

  changeButtonCount: (projectId, roomId, keypadId, count) => {
    const projects = mutateProject(get().projects, projectId, p => ({
      ...p,
      rooms: p.rooms.map(r =>
        r.id === roomId
          ? {
              ...r,
              keypads: r.keypads.map(k => {
                if (k.id !== keypadId) return k;
                const existing = k.buttons;
                const newButtons = createDefaultButtons(count).map((b, i) => ({
                  ...b,
                  ...(existing[i] ? { label: existing[i].label, actionType: existing[i].actionType, notes: existing[i].notes } : {}),
                }));
                return { ...k, buttonCount: count, buttons: newButtons };
              }),
            }
          : r,
      ),
    }));
    set({ projects });
    const updated = projects.find(p => p.id === projectId);
    if (updated) saveProject(updated);
  },

  // ── Button CRUD ───────────────────────────────────────────────────
  updateButton: (projectId, roomId, keypadId, buttonId, data) => {
    const projects = mutateProject(get().projects, projectId, p => ({
      ...p,
      rooms: p.rooms.map(r =>
        r.id === roomId
          ? {
              ...r,
              keypads: r.keypads.map(k =>
                k.id === keypadId
                  ? { ...k, buttons: k.buttons.map(b => (b.id === buttonId ? { ...b, ...data } : b)) }
                  : k,
              ),
            }
          : r,
      ),
    }));
    set({ projects });
    const updated = projects.find(p => p.id === projectId);
    if (updated) saveProject(updated);
  },

  // ── Comments ──────────────────────────────────────────────────────
  addComment: (projectId, roomId, keypadId, buttonId, data) => {
    const comment: ButtonComment = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const projects = mutateProject(get().projects, projectId, p => ({
      ...p,
      rooms: p.rooms.map(r =>
        r.id === roomId
          ? {
              ...r,
              keypads: r.keypads.map(k =>
                k.id === keypadId
                  ? {
                      ...k,
                      buttons: k.buttons.map(b =>
                        b.id === buttonId ? { ...b, comments: [...b.comments, comment] } : b,
                      ),
                    }
                  : k,
              ),
            }
          : r,
      ),
    }));
    set({ projects });
    const updated = projects.find(p => p.id === projectId);
    if (updated) saveProject(updated);
  },

  resolveComment: (projectId, roomId, keypadId, buttonId, commentId) => {
    const projects = mutateProject(get().projects, projectId, p => ({
      ...p,
      rooms: p.rooms.map(r =>
        r.id === roomId
          ? {
              ...r,
              keypads: r.keypads.map(k =>
                k.id === keypadId
                  ? {
                      ...k,
                      buttons: k.buttons.map(b =>
                        b.id === buttonId
                          ? {
                              ...b,
                              comments: b.comments.map(c =>
                                c.id === commentId ? { ...c, resolved: true } : c,
                              ),
                            }
                          : b,
                      ),
                    }
                  : k,
              ),
            }
          : r,
      ),
    }));
    set({ projects });
    const updated = projects.find(p => p.id === projectId);
    if (updated) saveProject(updated);
  },

  // ── Selectors ─────────────────────────────────────────────────────
  activeProject: () => get().projects.find(p => p.id === get().activeProjectId) ?? null,
  activeRoom: () => {
    const p = get().activeProject();
    return p?.rooms.find(r => r.id === get().activeRoomId) ?? null;
  },
  activeKeypad: () => {
    const r = get().activeRoom();
    return r?.keypads.find(k => k.id === get().activeKeypadId) ?? null;
  },
  activeButton: () => {
    const k = get().activeKeypad();
    return k?.buttons.find(b => b.id === get().activeButtonId) ?? null;
  },
}));
