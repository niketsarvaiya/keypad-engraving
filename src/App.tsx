import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { useRepositoryStore } from './store/useRepositoryStore';
import { ProjectsPage } from './pages/ProjectsPage';
import { EditorPage } from './pages/EditorPage';
import { ClientViewPage } from './pages/ClientViewPage';
import { RepositoryPage } from './pages/RepositoryPage';
import { createDemoProject2, createRuiaProject } from './lib/defaults';
import { saveProject } from './lib/storage';

export default function App() {
  const { view, hydrate, theme } = useStore();
  const { hydrate: hydrateRepo } = useRepositoryStore();

  useEffect(() => {
    // Seed demo project 2 (Skyline Penthouse) BEFORE hydrating so it
    // appears in the initial state on a fresh device / cleared localStorage
    if (!localStorage.getItem('engraving_demo2_seeded')) {
      const demo2 = createDemoProject2();
      saveProject(demo2);
      localStorage.setItem('engraving_demo2_seeded', '1');
    }
    if (!localStorage.getItem('engraving_ruia_seeded')) {
      const ruia = createRuiaProject();
      saveProject(ruia);
      localStorage.setItem('engraving_ruia_seeded', '1');
    }
    // Hydrate repository (auto-seeds models on first visit, adds new ones on subsequent visits)
    hydrateRepo();
    // Hydrate projects from localStorage
    hydrate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    // Light is the default (:root) — only apply a class for dark/system
    html.classList.remove('dark', 'system');
    if (theme === 'dark' || theme === 'system') html.classList.add(theme);
  }, [theme]);

  if (view === 'editor') return <EditorPage />;
  if (view === 'client-view') return <ClientViewPage />;
  if (view === 'repository') return <RepositoryPage />;
  return <ProjectsPage />;
}
