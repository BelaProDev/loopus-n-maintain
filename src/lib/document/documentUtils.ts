import { dropboxAuth } from '@/lib/auth/dropbox';
import { files, DropboxResponse } from 'dropbox/types/dropbox_types';

export interface FileMetadata {
  id: string;
  name: string;
  path: string;
  size: number;
  isFolder: boolean;
  lastModified: string;
  '.tag': string;
  path_display?: string;
}

export const listFiles = async (path: string): Promise<FileMetadata[]> => {
  const client = dropboxAuth.getClient();
  if (!client) throw new Error('Not authenticated with Dropbox');

  const response = await client.filesListFolder({ path });
  return response.result.entries.map(entry => ({
    id: entry.path_lower || entry.path_display || '',
    name: entry.name,
    path: entry.path_display || '',
    size: 'size' in entry ? entry.size : 0,
    isFolder: entry['.tag'] === 'folder',
    lastModified: 'server_modified' in entry ? entry.server_modified : new Date().toISOString(),
    '.tag': entry['.tag'],
    path_display: entry.path_display
  }));
};

export const uploadFile = async (file: File, path: string): Promise<FileMetadata> => {
  const client = dropboxAuth.getClient();
  if (!client) throw new Error('Not authenticated with Dropbox');

  const response = await client.filesUpload({
    path: `${path}/${file.name}`,
    contents: await file.arrayBuffer()
  });

  return {
    id: response.result.path_lower || response.result.path_display || '',
    name: response.result.name,
    path: response.result.path_display || '',
    size: response.result.size,
    isFolder: false,
    lastModified: response.result.server_modified,
    '.tag': 'file',
    path_display: response.result.path_display
  };
};

export const downloadFile = async (path: string): Promise<Blob> => {
  const client = dropboxAuth.getClient();
  if (!client) throw new Error('Not authenticated with Dropbox');

  const response = await client.filesDownload({ path });
  // The Dropbox API types are incorrect, the actual response includes a fileBlob
  const result = response as unknown as { result: { fileBlob: Blob } };
  return result.result.fileBlob;
};

export const createFolder = async (path: string): Promise<FileMetadata> => {
  const client = dropboxAuth.getClient();
  if (!client) throw new Error('Not authenticated with Dropbox');

  const response = await client.filesCreateFolderV2({ path });
  const metadata = response.result.metadata;

  return {
    id: metadata.path_lower || metadata.path_display || '',
    name: metadata.name,
    path: metadata.path_display || '',
    size: 0,
    isFolder: true,
    lastModified: new Date().toISOString(),
    '.tag': 'folder',
    path_display: metadata.path_display
  };
};

export const deleteFile = async (path: string): Promise<void> => {
  const client = dropboxAuth.getClient();
  if (!client) throw new Error('Not authenticated with Dropbox');

  await client.filesDeleteV2({ path });
};