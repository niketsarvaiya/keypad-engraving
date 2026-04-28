import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { useRepositoryStore } from './store/useRepositoryStore';
import { ProjectsPage } from './pages/ProjectsPage';
import { EditorPage } from './pages/EditorPage';
import { ClientViewPage } from './pages/ClientViewPage';
import { RepositoryPage } from './pages/RepositoryPage';

export default function App() {
  const { view, hydrate } = useStore();
  const { hydrate: hydrateRepo } = useRepositoryStore();

  useEffect(() => {
    hydrate();
    hydrateRepo();
  }, [hydrate, hydrateRepo]);

  if (view === 'editor') return <EditorPage />;
  if (view === 'client-view') return <ClientViewPage />;
  if (view === 'repository') return <RepositoryPage />;
  return <ProjectsPage />;
}
