import { useEffect, useState } from 'react';
import { useDropbox } from '@/contexts/DropboxContext';
import { Button } from '@/components/ui/button';
import { FileList } from './components/FileList';
import { ExplorerToolbar } from './components/ExplorerToolbar';
import { NavigationBreadcrumb } from './components/NavigationBreadcrumb';
import { toast } from 'sonner';

const DropboxExplorer = () => {
  const { isAuthenticated, connect } = useDropbox();
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    const token = window.localStorage.getItem('dropboxToken');
    if (!token && !isAuthenticated) {
      toast.info('Please connect to Dropbox to continue');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold mb-6">Dropbox Explorer</h1>
        <p className="text-gray-600 mb-8">Connect to Dropbox to start exploring your files</p>
        <Button onClick={connect}>
          Connect to Dropbox
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">Dropbox Explorer</h1>
      <NavigationBreadcrumb path={currentPath} onNavigate={setCurrentPath} />
      <ExplorerToolbar currentPath={currentPath} />
      <FileList path={currentPath} onNavigate={setCurrentPath} />
    </div>
  );
};

export default DropboxExplorer;