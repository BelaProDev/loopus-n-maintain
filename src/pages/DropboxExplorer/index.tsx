import { useEffect, useState } from 'react';
import { useDropbox } from '@/contexts/DropboxContext';
import { Button } from '@/components/ui/button';
import { FileList } from './components/FileList';
import { ExplorerToolbar } from './components/ExplorerToolbar';
import { NavigationBreadcrumb } from './components/NavigationBreadcrumb';
import { toast } from 'sonner';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useDropboxManager } from '@/hooks/useDropboxManager';

const DropboxExplorer = () => {
  const { isAuthenticated, connect } = useDropbox();
  const [currentPath, setCurrentPath] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  const {
    files,
    isLoading,
    uploadMutation,
    createFolderMutation,
    refetch
  } = useDropboxManager(currentPath);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        uploadMutation.mutate({ file, path: currentPath });
      });
    }
  };

  const handleDrop = (files: FileList, path: string) => {
    Array.from(files).forEach(file => {
      uploadMutation.mutate({ file, path });
    });
  };

  const handleCreateFolder = (name: string) => {
    const path = `${currentPath}/${name}`.replace(/\/+/g, '/');
    createFolderMutation.mutate(path, {
      onSuccess: () => {
        toast.success('Folder created successfully');
        refetch();
      }
    });
  };

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

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen">
      <ResizablePanel defaultSize={25} minSize={20}>
        <div className="h-full p-4 border-r">
          <h2 className="font-semibold mb-4">Favorites</h2>
          {/* Add favorite folders/files here */}
        </div>
      </ResizablePanel>
      
      <ResizableHandle />
      
      <ResizablePanel defaultSize={75}>
        <div className="container mx-auto p-4 space-y-4">
          <h1 className="text-3xl font-bold">Dropbox Explorer</h1>
          
          <NavigationBreadcrumb 
            currentPath={currentPath} 
            onNavigate={setCurrentPath} 
          />
          
          <ExplorerToolbar
            onFileSelect={handleFileSelect}
            isUploading={uploadMutation.isPending}
            onViewModeChange={setViewMode}
            viewMode={viewMode}
            onRefresh={refetch}
            onCreateFolder={handleCreateFolder}
            currentPath={currentPath}
          />
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <FileList 
              files={files || []} 
              onNavigate={setCurrentPath}
              onDrop={handleDrop}
              currentPath={currentPath}
            />
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default DropboxExplorer;