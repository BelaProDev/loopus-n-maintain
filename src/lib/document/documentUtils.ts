import { dropboxAuth } from '@/lib/auth/dropbox';

export interface FileMetadata {
  id: string;
  name: string;
  path: string;
  size: number;
  isFolder: boolean;
  lastModified: string;
}

export const listFiles = async (path: string): Promise<FileMetadata[]> => {
  const client = await dropboxAuth.getClient();
  if (!client) throw new Error('Not authenticated with Dropbox');

  const response = await client.filesListFolder({ path });
  return response.result.entries.map(entry => ({
    id: entry.id,
    name: entry.name,
    path: entry.path_display || '',
    size: 'size' in entry ? entry.size : 0,
    isFolder: entry['.tag'] === 'folder',
    lastModified: 'server_modified' in entry ? entry.server_modified : new Date().toISOString()
  }));
};

export const uploadFile = async (file: File, path: string): Promise<FileMetadata> => {
  const client = await dropboxAuth.getClient();
  if (!client) throw new Error('Not authenticated with Dropbox');

  const response = await client.filesUpload({
    path: `${path}/${file.name}`,
    contents: await file.arrayBuffer()
  });

  return {
    id: response.result.id,
    name: response.result.name,
    path: response.result.path_display || '',
    size: response.result.size,
    isFolder: false,
    lastModified: response.result.server_modified
  };
};

export const downloadFile = async (path: string): Promise<Blob> => {
  const client = await dropboxAuth.getClient();
  if (!client) throw new Error('Not authenticated with Dropbox');

  const response = await client.filesDownload({ path });
  if ('fileBlob' in response.result) {
    return response.result.fileBlob;
  }
  throw new Error('Failed to download file');
};

export const createFolder = async (path: string): Promise<FileMetadata> => {
  const client = await dropboxAuth.getClient();
  if (!client) throw new Error('Not authenticated with Dropbox');

  const response = await client.filesCreateFolderV2({ path });
  const metadata = response.result.metadata;

  return {
    id: metadata.id,
    name: metadata.name,
    path: metadata.path_display || '',
    size: 0,
    isFolder: true,
    lastModified: new Date().toISOString()
  };
};

export const deleteFile = async (path: string): Promise<void> => {
  const client = await dropboxAuth.getClient();
  if (!client) throw new Error('Not authenticated with Dropbox');

  await client.filesDeleteV2({ path });
};