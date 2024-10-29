import { Dropbox, files } from 'dropbox';

const getDropboxClient = () => {
  if (typeof window === 'undefined') return null;
  const token = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN;
  if (!token) {
    throw new Error('Dropbox access token is not configured');
  }
  return new Dropbox({ accessToken: token });
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

    // Clean and validate path
    const cleanPath = path.replace(/^\/+/, '').replace(/\/+$/, '');
    const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const sanitizedPath = cleanPath ? `/${cleanPath}/${fileName}` : `/${fileName}`;

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
    const sanitizedPath = path ? `/${path.replace(/^\/+/, '')}` : '';
    const response = await dbx.filesListFolder({
      path: sanitizedPath,
    });
    return response.result.entries;
  } catch (error) {
    console.error('Dropbox list error:', error);
    throw error;
  }
};

interface DropboxDownloadResponse extends files.FileMetadata {
  fileBlob: Blob;
}

export const downloadFile = async (path: string): Promise<Blob> => {
  const dbx = getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  try {
    const response = await dbx.filesDownload({
      path: path,
    });
    const result = response.result as unknown as DropboxDownloadResponse;
    return result.fileBlob;
  } catch (error) {
    console.error('Dropbox download error:', error);
    throw error;
  }
};