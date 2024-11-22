import { useDropbox } from '@/contexts/DropboxContext';
import { Button } from '@/components/ui/button';
import { ExplorerContent } from '@/components/dropbox/ExplorerContent';

const DropboxExplorer = () => {
  const { isAuthenticated, connect } = useDropbox();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold mb-6">Dropbox Explorer</h1>
        <p className="text-muted-foreground mb-8">Connect to Dropbox to start exploring your files</p>
        
        <Button onClick={connect}>
          Connect to Dropbox
        </Button>
      </div>
    );
  }

  return <ExplorerContent />;
};

export default DropboxExplorer;