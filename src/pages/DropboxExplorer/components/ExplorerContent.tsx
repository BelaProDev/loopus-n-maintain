import { useState } from 'react';
import { useDropbox } from '@/contexts/DropboxContext';
import { FileList } from './FileList';
import { ExplorerToolbar } from './ExplorerToolbar';
import { NavigationBreadcrumb } from './NavigationBreadcrumb';
import { toast } from 'sonner';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { DropboxEntry } from '@/types/dropbox';

export const ExplorerContent = () => {
  const { client } = useDropbox();
  const [currentPath, setCurrentPath] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [files, setFiles] = useState<DropboxEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFiles = async () => {
    if (!client) return;
    
    setIsLoading(true);
    try {
      const response = await client.filesListFolder({
        path: currentPath || '',
        include_mounted_folders: true,
        include_non_downloadable_files: true
      });

      setFiles(response.result.entries);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to fetch files');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !client) return;

    for (const file of Array.from(files)) {
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          const arrayBuffer = reader.result as ArrayBuffer;
          await client.filesUpload({
            path: `${currentPath}/${file.name}`,
            contents: arrayBuffer,
            mode: { '.tag': 'add' },
            autorename: true
          });
        };
        reader.readAsArrayBuffer(file);
        toast.success(`Uploading ${file.name}`);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    fetchFiles();
  };

  const handleDrop = async (files: FileList, path: string) => {
    if (!client) return;
    
    for (const file of Array.from(files)) {
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          const arrayBuffer = reader.result as ArrayBuffer;
          await client.filesUpload({
            path: `${path}/${file.name}`,
            contents: arrayBuffer,
            mode: { '.tag': 'add' },
            autorename: true
          });
          fetchFiles();
        };
        reader.readAsArrayBuffer(file);
        toast.success(`Uploading ${file.name}`);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  };

  const handleCreateFolder = async (name: string) => {
    if (!client) return;
    
    try {
      await client.filesCreateFolderV2({
        path: `${currentPath}/${name}`.replace(/\/+/g, '/'),
        autorename: true
      });
      toast.success('Folder created successfully');
      fetchFiles();
    } catch (error) {
      console.error('Create folder error:', error);
      toast.error('Failed to create folder');
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen">
      <ResizablePanel defaultSize={25} minSize={20}>
        <div className="h-full p-4 border-r">
          <h2 className="font-semibold mb-4">Favorites</h2>
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
            isUploading={false}
            onViewModeChange={setViewMode}
            viewMode={viewMode}
            onRefresh={fetchFiles}
            onCreateFolder={handleCreateFolder}
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
              onDrop={handleDrop}
              currentPath={currentPath}
            />
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};