import { create } from 'zustand';
import type { KeypadModel } from '../types';
import { loadModels, saveModel as persistModel, deleteModelById } from '../lib/repositoryStorage';
import { generateId } from '../lib/defaults';

interface RepositoryStore {
  models: KeypadModel[];
  hydrate: () => void;
  addModel: (data: Omit<KeypadModel, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateModel: (id: string, data: Partial<KeypadModel>) => void;
  deleteModel: (id: string) => void;
  getModel: (id: string) => KeypadModel | undefined;
}

export const useRepositoryStore = create<RepositoryStore>((set, get) => ({
  models: [],
  hydrate: () => set({ models: loadModels() }),

  addModel: data => {
    const now = new Date().toISOString();
    const model: KeypadModel = { ...data, id: generateId(), createdAt: now, updatedAt: now };
    const models = [model, ...get().models];
    set({ models });
    persistModel(model);
    return model.id;
  },

  updateModel: (id, data) => {
    const models = get().models.map(m =>
      m.id === id ? { ...m, ...data, updatedAt: new Date().toISOString() } : m
    );
    set({ models });
    const updated = models.find(m => m.id === id);
    if (updated) persistModel(updated);
  },

  deleteModel: id => {
    set({ models: get().models.filter(m => m.id !== id) });
    deleteModelById(id);
  },

  getModel: id => get().models.find(m => m.id === id),
}));
