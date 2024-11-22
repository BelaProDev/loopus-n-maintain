import { useState, useEffect } from 'react';
import { useDropbox } from '@/contexts/DropboxContext';
import { FileList } from '@/pages/DropboxExplorer/components/FileList';
import { ExplorerToolbar } from '@/pages/DropboxExplorer/components/ExplorerToolbar';
import { NavigationBreadcrumb } from '@/pages/DropboxExplorer/components/NavigationBreadcrumb';
import { useFileOperations } from '@/hooks/useFileOperations';
import { useDropboxFiles } from '@/hooks/useDropboxFiles';

export const ExplorerContent = () => {
  const { client } = useDropbox();
  const [currentPath, setCurrentPath] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  const { files, isLoading, fetchFiles } = useDropboxFiles(currentPath);
  const { uploadFiles, createFolder, isUploading } = useFileOperations(currentPath, fetchFiles);

  useEffect(() => {
    if (client) {
      fetchFiles();
    }
  }, [client, currentPath]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    uploadFiles(files);
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">Dropbox Explorer</h1>
      
      <NavigationBreadcrumb 
        currentPath={currentPath} 
        onNavigate={setCurrentPath} 
      />
      
      <ExplorerToolbar
        onFileSelect={handleFileSelect}
        isUploading={isUploading}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
        onRefresh={fetchFiles}
        onCreateFolder={createFolder}
        currentPath={currentPath}
      />
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <FileList 
          files={files} 
          onNavigate={setCurrentPath}
          onDrop={uploadFiles}
          currentPath={currentPath}
        />
      )}
    </div>
  );
};