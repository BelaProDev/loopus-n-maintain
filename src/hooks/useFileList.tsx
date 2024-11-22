import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDropbox } from '@/contexts/DropboxContext';
import { toast } from 'sonner';
import type { DropboxEntry } from '@/types/dropbox';

export const useFileList = (path: string) => {
  const { client } = useDropbox();

  return useQuery({
    queryKey: ['dropbox-files', path],
    queryFn: async (): Promise<DropboxEntry[]> => {
      if (!client) throw new Error('Dropbox client not initialized');

      const response = await client.filesListFolder({
        path: path || '',
        include_mounted_folders: true,
        include_non_downloadable_files: true
      });

      return response.result.entries.map(entry => {
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
    },
    onError: () => {
      toast.error('Failed to fetch files');
    }
  });
};