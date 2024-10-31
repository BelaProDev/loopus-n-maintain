import { Dropbox } from 'dropbox';
import { dropboxAuth } from './auth/dropbox';

const ROOT_FOLDER = '';  // Changed to empty string to access root folder

export const getDropboxClient = () => {
  if (typeof window === 'undefined') return null;
  
  const accessToken = dropboxAuth.getAccessToken();
  if (!accessToken) {
    throw new Error('No Dropbox access token found');
  }
  
  return new Dropbox({ accessToken });
};

const sanitizePath = (path: string) => {
  // Remove any double slashes and leading/trailing slashes
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

  try {
    const sanitizedPath = `/${sanitizePath(path)}`;
    const response = await dbx.filesCreateFolderV2({
      path: sanitizedPath,
      autorename: true
    });
    return response.result;
  } catch (error) {
    console.error('Dropbox create folder error:', error);
    throw error;
  }
};

export const deleteFile = async (path: string) => {
  const dbx = getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  try {
    const response = await dbx.filesDeleteV2({
      path: path,
    });
    return response.result;
  } catch (error) {
    console.error('Dropbox delete error:', error);
    throw error;
  }
};

export const listFiles = async (path: string = '') => {
  const dbx = getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  try {
    const listPath = path === '/' ? '' : `/${sanitizePath(path)}`;
    const response = await dbx.filesListFolder({
      path: listPath,
    });
    return response.result.entries;
  } catch (error) {
    console.error('Dropbox list error:', error);
    throw error;
  }
};

export const downloadFile = async (path: string): Promise<Blob> => {
  const dbx = getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  try {
    const response = await dbx.filesDownload({
      path: path,
    }) as any;
    return response.result.fileBlob;
  } catch (error) {
    console.error('Dropbox download error:', error);
    throw error;
  }
};