import { Dropbox } from 'dropbox';
import { dropboxAuth } from './auth/dropbox';

const getDropboxClient = async () => {
  const client = await dropboxAuth.getClient();
  if (!client) throw new Error('Dropbox client not initialized');
  return client;
};

export const uploadFile = async (file: File | Blob, path: string, fileName?: string) => {
  const dbx = await getDropboxClient();
  
  try {
    if (file instanceof File && file.size > 150 * 1024 * 1024) {
      throw new Error('File size exceeds 150MB limit');
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileContent = new Uint8Array(arrayBuffer);
    const cleanFileName = fileName || (file instanceof File ? file.name : 'file');
    const sanitizedFileName = cleanFileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uploadPath = path === '' ? `/${sanitizedFileName}` : `/${path.replace(/\/+/g, '/')}/${sanitizedFileName}`;

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

export const listFiles = async (path: string = '') => {
  const dbx = await getDropboxClient();
  
  try {
    const response = await dbx.filesListFolder({
      path: path.replace(/\/+/g, '/').replace(/^\/|\/$/g, ''),
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
      return [];
    }
    throw error;
  }
};

export const downloadFile = async (path: string): Promise<Blob> => {
  const dbx = await getDropboxClient();
  
  try {
    const response = await dbx.filesDownload({ path }) as any;
    return response.result.fileBlob;
  } catch (error) {
    console.error('Dropbox download error:', error);
    throw error;
  }
};

export const createFolder = async (path: string) => {
  const dbx = await getDropboxClient();
  
  try {
    const response = await dbx.filesCreateFolderV2({
      path: `/${path.replace(/\/+/g, '/')}`,
      autorename: true
    });
    return response.result;
  } catch (error) {
    console.error('Dropbox create folder error:', error);
    throw error;
  }
};

export const deleteFile = async (path: string) => {
  const dbx = await getDropboxClient();
  
  try {
    const response = await dbx.filesDeleteV2({ path });
    return response.result;
  } catch (error) {
    console.error('Dropbox delete error:', error);
    throw error;
  }
};