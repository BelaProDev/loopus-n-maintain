import { Dropbox } from 'dropbox';
import { dropboxAuth } from './auth/dropbox';
import { sanitizePath, sanitizeFileName } from './utils/pathUtils';

const getDropboxClient = async () => {
  const client = await dropboxAuth.getClient();
  if (!client) throw new Error('Dropbox client not initialized');
  return client;
};

export const uploadFile = async (file: File | Blob, path: string, fileName?: string) => {
  const dbx = await getDropboxClient();
  
  if (file instanceof File && file.size > 150 * 1024 * 1024) {
    throw new Error('File size exceeds 150MB limit');
  }

  const arrayBuffer = await file.arrayBuffer();
  const fileContent = new Uint8Array(arrayBuffer);
  const cleanFileName = sanitizeFileName(fileName || (file instanceof File ? file.name : 'file'));
  const uploadPath = `${sanitizePath(path)}/${cleanFileName}`;

  const response = await dbx.filesUpload({
    path: uploadPath,
    contents: fileContent,
    mode: { '.tag': 'overwrite' },
    autorename: true
  });

  return response.result;
};

export const listFiles = async (path: string = '') => {
  const dbx = await getDropboxClient();
  
  const response = await dbx.filesListFolder({
    path: sanitizePath(path),
    recursive: false,
    include_mounted_folders: true,
    include_non_downloadable_files: true
  });
  
  return response.result.entries.map(entry => ({
    ...entry,
    path_display: entry.path_display || entry.path_lower || '',
    name: entry.name || entry.path_display?.split('/').pop() || 'Unnamed'
  }));
};

export const downloadFile = async (path: string): Promise<Blob> => {
  const dbx = await getDropboxClient();
  const response = await dbx.filesDownload({ path }) as any;
  return response.result.fileBlob;
};

export const createFolder = async (path: string) => {
  const dbx = await getDropboxClient();
  const response = await dbx.filesCreateFolderV2({
    path: sanitizePath(path),
    autorename: true
  });
  return response.result;
};

export const deleteFile = async (path: string) => {
  const dbx = await getDropboxClient();
  const response = await dbx.filesDeleteV2({ path });
  return response.result;
};