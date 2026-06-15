import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { useRepositoryStore } from './store/useRepositoryStore';
import { ProjectsPage } from './pages/ProjectsPage';
import { EditorPage } from './pages/EditorPage';
import { ClientViewPage } from './pages/ClientViewPage';
import { RepositoryPage } from './pages/RepositoryPage';

export default function App() {
  const { view, hydrate, theme } = useStore();
  const { hydrate: hydrateRepo } = useRepositoryStore();

  useEffect(() => {
    hydrate();
    hydrateRepo();
  }, [hydrate, hydrateRepo]);

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
