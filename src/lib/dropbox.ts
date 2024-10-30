import { Dropbox } from 'dropbox';

export const getDropboxClient = () => {
  if (typeof window === 'undefined') return null;
  
  const tokens = JSON.parse(sessionStorage.getItem('dropbox_tokens') || '{}');
  const accessToken = tokens.access_token;
  
  if (!accessToken) {
    throw new Error('No Dropbox access token found in session storage');
  }
  
  return new Dropbox({ accessToken });
};

export const uploadFile = async (file: File, path: string) => {
  const dbx = getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  try {
    // Validate file size (max 150MB for Dropbox API)
    if (file.size > 150 * 1024 * 1024) {
      throw new Error('File size exceeds 150MB limit');
    }

    // Convert File to ArrayBuffer for Dropbox API
    const arrayBuffer = await file.arrayBuffer();
    const fileContent = new Uint8Array(arrayBuffer);

    // Clean and validate path, ensuring it's in the loopusandmaintain folder
    const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const sanitizedPath = `/loopusandmaintain/${path.replace(/^\/+/, '')}/${fileName}`.replace(/\/+/g, '/');

    const response = await dbx.filesUpload({
      path: sanitizedPath,
      contents: fileContent,
      mode: { '.tag': 'overwrite' },
      autorename: true
    });
    return response.result;
  } catch (error) {
    console.error('Dropbox upload error:', error);
    if (error.status === 400) {
      throw new Error('Invalid file or path. Please check the file name and try again.');
    } else if (error.status === 401) {
      throw new Error('Authentication failed. Please check your Dropbox token.');
    } else if (error.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }
    throw new Error('Failed to upload file. Please try again.');
  }
};

export const listFiles = async (path: string = '') => {
  const dbx = getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  try {
    const sanitizedPath = path ? `/loopusandmaintain/${path.replace(/^\/+/, '')}` : '/loopusandmaintain';
    const response = await dbx.filesListFolder({
      path: sanitizedPath,
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
    const sanitizedPath = path.startsWith('/loopusandmaintain') ? path : `/loopusandmaintain/${path}`;
    const response = await dbx.filesDownload({
      path: sanitizedPath,
    }) as any;
    return response.result.fileBlob;
  } catch (error) {
    console.error('Dropbox download error:', error);
    throw error;
  }
};