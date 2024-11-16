import { DropboxFile, DropboxResponse } from '@/types/dropbox';
import { Dropbox } from 'dropbox';
import { dropboxAuth } from '@/lib/auth/dropbox';

const getClient = async () => {
  const client = await dropboxAuth.getClient();
  if (!client) throw new Error('Not authenticated with Dropbox');
  return client;
};

export const dropboxClient = {
  async listFolder(path: string): Promise<DropboxFile[]> {
    const client = await getClient();
    const response = await client.filesListFolder({
      path,
      recursive: false,
      include_mounted_folders: true,
      include_non_downloadable_files: true
    });
    
    return response.result.entries.map(entry => ({
      id: entry.path_lower || entry.path_display || '',
      name: entry.name,
      path: entry.path_display || '',
      path_display: entry.path_display,
      path_lower: entry.path_lower,
      '.tag': entry['.tag'],
      size: 'size' in entry ? entry.size : 0,
      isFolder: entry['.tag'] === 'folder',
      lastModified: 'server_modified' in entry ? entry.server_modified : new Date().toISOString(),
      client_modified: 'client_modified' in entry ? entry.client_modified : undefined,
      server_modified: 'server_modified' in entry ? entry.server_modified : undefined,
      rev: 'rev' in entry ? entry.rev : undefined
    }));
  },

  async uploadFile(file: File, path: string): Promise<DropboxFile> {
    const client = await getClient();
    const arrayBuffer = await file.arrayBuffer();
    const response = await client.filesUpload({
      path: `${path}/${file.name}`,
      contents: arrayBuffer,
      mode: { '.tag': 'overwrite' },
      autorename: true
    });

    return {
      id: response.result.id,
      name: response.result.name,
      path: response.result.path_display || '',
      path_display: response.result.path_display,
      path_lower: response.result.path_lower,
      '.tag': 'file',
      size: response.result.size,
      isFolder: false,
      lastModified: response.result.server_modified,
      client_modified: response.result.client_modified,
      server_modified: response.result.server_modified,
      rev: response.result.rev
    };
  },

  async downloadFile(path: string): Promise<Blob> {
    const client = await getClient();
    type DropboxDownloadResponse = {
      result: {
        fileBlob: Blob;
      };
    };
    const response = await client.filesDownload({ path }) as unknown as DropboxDownloadResponse;
    return response.result.fileBlob;
  },

  async deleteFile(path: string): Promise<void> {
    const client = await getClient();
    await client.filesDeleteV2({ path });
  }
};