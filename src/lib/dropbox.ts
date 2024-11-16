import { Dropbox } from 'dropbox';
import { dropboxAuth } from './auth/dropbox';

const getDropboxClient = () => {
  if (typeof window === 'undefined') return null;
  
  const accessToken = dropboxAuth.getAccessToken();
  if (!accessToken) {
    throw new Error('No Dropbox access token found');
  }
  
  return new Dropbox({ accessToken });
};

const sanitizePath = (path: string) => {
  if (path === '/') return '';
  return path.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');
};

export const uploadFile = async (file: File | Blob, path: string, fileName?: string) => {
  const dbx = getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  try {
    if (file instanceof File && file.size > 150 * 1024 * 1024) {
      throw new Error('File size exceeds 150MB limit');
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileContent = new Uint8Array(arrayBuffer);

    const cleanFileName = fileName || (file instanceof File ? file.name : 'file');
    const sanitizedFileName = cleanFileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uploadPath = path === '/' ? `/${sanitizedFileName}` : `/${sanitizePath(path)}/${sanitizedFileName}`;

    const response = await dbx.filesUpload({
      path: uploadPath,
      contents: fileContent,
      mode: { '.tag': 'overwrite' },
      autorename: true
    });
    return response.result;
  } catch (error) {
    console.error('Dropbox upload error:', error);
    throw error;
  }
};

export const createFolder = async (path: string) => {
  const dbx = getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  const sanitizedPath = `/${sanitizePath(path)}`;
  const response = await dbx.filesCreateFolderV2({
    path: sanitizedPath,
    autorename: true
  });
  return response.result;
};

export const deleteFile = async (path: string) => {
  const dbx = getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  const response = await dbx.filesDeleteV2({
    path: path,
  });
  return response.result;
};

export const deleteFolder = async (path: string) => {
  return deleteFile(path);
};

export const listFiles = async (path: string = '') => {
  const dbx = getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  const sanitizedPath = sanitizePath(path);
  try {
    const response = await dbx.filesListFolder({
      path: sanitizedPath,
      recursive: false,
      include_mounted_folders: true,
      include_non_downloadable_files: true
    });
    
    return response.result.entries.map(entry => ({
      ...entry,
      path_display: entry.path_display || entry.path_lower || '',
      name: entry.name || entry.path_display?.split('/').pop() || 'Unnamed'
    }));
  } catch (error) {
    if ((error as any)?.status === 409) {
      // If path not found, return empty array instead of throwing
      return [];
    }
    throw error;
  }
};

export const downloadFile = async (path: string): Promise<Blob> => {
  const dbx = getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  const response = await dbx.filesDownload({
    path: path,
  }) as any;
  return response.result.fileBlob;
};

export const downloadFolder = async (path: string): Promise<Blob> => {
  const dbx = getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  const response = await dbx.filesDownloadZip({
    path: path,
  }) as any;
  return response.result.fileBlob;
};