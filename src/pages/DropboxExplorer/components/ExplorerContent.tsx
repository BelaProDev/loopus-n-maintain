import { useState, useEffect } from 'react';
import { useDropbox } from '@/contexts/DropboxContext';
import { FileList } from './FileList';
import { ExplorerToolbar } from './ExplorerToolbar';
import { NavigationBreadcrumb } from './NavigationBreadcrumb';
import { toast } from 'sonner';
import { DropboxEntry } from '@/types/dropbox';
import { dropboxAuth } from '@/lib/api/dropboxAuth';

export const ExplorerContent = () => {
  const { isAuthenticated } = useDropbox();
  const [currentPath, setCurrentPath] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [files, setFiles] = useState<DropboxEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFiles = async () => {
    const client = dropboxAuth.getClient();
    if (!client) {
      toast.error('Dropbox client not initialized');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await client.filesListFolder({
        path: currentPath || '',
        include_mounted_folders: true,
        include_non_downloadable_files: true
      });

      if (!response.result.entries) {
        throw new Error('No entries in response');
      }

      const mappedEntries: DropboxEntry[] = response.result.entries.map(entry => {
        const baseEntry = {
          id: entry.id || entry.path_lower || entry.path_display || crypto.randomUUID(),
          name: entry.name,
          path_lower: entry.path_lower,
          path_display: entry.path_display,
          '.tag': entry['.tag'] as DropboxEntry['.tag']
        };

        if (entry['.tag'] === 'file') {
          return {
            ...baseEntry,
            '.tag': 'file' as const,
            size: entry.size,
            is_downloadable: entry.is_downloadable,
            client_modified: entry.client_modified,
            server_modified: entry.server_modified,
            rev: entry.rev,
            content_hash: entry.content_hash
          };
        }

        if (entry['.tag'] === 'folder') {
          return {
            ...baseEntry,
            '.tag': 'folder' as const
          };
        }

        return {
          ...baseEntry,
          '.tag': 'deleted' as const
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
    if (isAuthenticated) {
      fetchFiles();
    }
  }, [isAuthenticated, currentPath]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const client = dropboxAuth.getClient();
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
          toast.success(`Uploaded ${file.name}`);
          fetchFiles();
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  };

  const handleDrop = async (files: FileList, path: string) => {
    const client = dropboxAuth.getClient();
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
          toast.success(`Uploaded ${file.name}`);
          fetchFiles();
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  };

  const handleCreateFolder = async (name: string) => {
    const client = dropboxAuth.getClient();
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
  );
};