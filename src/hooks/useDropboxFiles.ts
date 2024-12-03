import { useState } from 'react';
import { useDropbox } from '@/contexts/DropboxContext';
import { toast } from 'sonner';
import type { DropboxEntry } from '@/types/dropbox';

export const useDropboxFiles = (path: string) => {
  const { client } = useDropbox();
  const [files, setFiles] = useState<DropboxEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFiles = async () => {
    if (!client) {
      toast.error('Dropbox client not initialized');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await client.filesListFolder({
        path: path || '',
        include_mounted_folders: true,
        include_non_downloadable_files: true
      });

      const mappedEntries: DropboxEntry[] = response.result.entries.map(entry => {
        const baseEntry = {
          id: entry.path_lower || entry.path_display || crypto.randomUUID(),
          name: entry.name,
          path_lower: entry.path_lower || '',
          path_display: entry.path_display || '',
          '.tag': entry['.tag'] as DropboxEntry['.tag']
        };

        if (entry['.tag'] === 'file') {
          return {
            ...baseEntry,
            '.tag': 'file' as const,
            size: entry.size || 0,
            is_downloadable: entry.is_downloadable || false,
            client_modified: entry.client_modified || new Date().toISOString(),
            server_modified: entry.server_modified || new Date().toISOString(),
            rev: entry.rev || '',
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

  return {
    files,
    isLoading,
    fetchFiles
  };
};