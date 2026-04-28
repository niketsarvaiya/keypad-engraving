import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { ProjectsPage } from './pages/ProjectsPage';
import { EditorPage } from './pages/EditorPage';
import { ClientViewPage } from './pages/ClientViewPage';

export default function App() {
  const { view, hydrate } = useStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (view === 'editor') return <EditorPage />;
  if (view === 'client-view') return <ClientViewPage />;
  return <ProjectsPage />;
}
