import { useEffect, useState } from 'react';
import { useDropbox } from '@/contexts/DropboxContext';
import { Button } from '@/components/ui/button';
import { FileList } from './components/FileList';
import { ExplorerToolbar } from './components/ExplorerToolbar';
import { NavigationBreadcrumb } from './components/NavigationBreadcrumb';
import { toast } from 'sonner';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { DropboxEntry } from '@/types/dropbox';
import { files } from 'dropbox';

const DropboxExplorer = () => {
  const { isAuthenticated, connect, client } = useDropbox();
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

      // Map the response entries to our DropboxEntry type
      const mappedEntries: DropboxEntry[] = response.result.entries.map(entry => {
        const baseMetadata = {
          '.tag': entry['.tag'],
          name: entry.name,
          path_lower: entry.path_lower,
          path_display: entry.path_display,
        };

        if (entry['.tag'] === 'file') {
          const fileEntry = entry as files.FileMetadataReference;
          return {
            ...baseMetadata,
            '.tag': 'file' as const,
            id: fileEntry.id,
            size: fileEntry.size,
            is_downloadable: fileEntry.is_downloadable,
            client_modified: fileEntry.client_modified,
            server_modified: fileEntry.server_modified,
            rev: fileEntry.rev,
            content_hash: fileEntry.content_hash
          };
        }

        if (entry['.tag'] === 'folder') {
          const folderEntry = entry as files.FolderMetadataReference;
          return {
            ...baseMetadata,
            '.tag': 'folder' as const,
            id: folderEntry.id
          };
        }

        // Handle deleted entries
        return {
          ...baseMetadata,
          '.tag': 'deleted' as const,
          id: entry.path_lower || entry.path_display || ''
        };
      });

      setFiles(mappedEntries);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to fetch files');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (client) {
      fetchFiles();
    }
  }, [client, currentPath]);

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

export default DropboxExplorer;