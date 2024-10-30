import { dropboxAuth } from './auth/dropbox';
import { files } from 'dropbox';
import { DropboxEntry, DropboxFile, DropboxFolder } from '@/types/dropbox';

export const uploadFile = async (file: File, path: string): Promise<DropboxEntry> => {
  const client = dropboxAuth.getClient();
  const arrayBuffer = await file.arrayBuffer();
  const response = await client.filesUpload({
    path: `${path}/${file.name}`,
    contents: arrayBuffer,
  });
  return {
    ...response.result,
    '.tag': 'file'
  } as DropboxFile;
};

export const listFiles = async (path: string): Promise<DropboxEntry[]> => {
  const client = dropboxAuth.getClient();
  const response = await client.filesListFolder({ path });
  return response.result.entries.map(entry => ({
    ...entry,
    '.tag': entry['.tag'] || 'file'
  }));
};

export const downloadFile = async (path: string): Promise<Blob> => {
  const client = dropboxAuth.getClient();
  const response = await client.filesDownload({ path });
  if ('fileBlob' in response.result && response.result.fileBlob instanceof Blob) {
    return response.result.fileBlob;
  }
  throw new Error('File download failed');
};

export const deleteFile = async (path: string): Promise<DropboxEntry> => {
  const client = dropboxAuth.getClient();
  const response = await client.filesDeleteV2({ path });
  return {
    ...response.result.metadata,
    '.tag': 'deleted',
    name: path.split('/').pop() || '',
  };
};

export const createFolder = async (path: string): Promise<DropboxEntry> => {
  const client = dropboxAuth.getClient();
  const response = await client.filesCreateFolderV2({ path });
  return {
    ...response.result.metadata,
    '.tag': 'folder',
    name: path.split('/').pop() || '',
  } as DropboxFolder;
};