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
    // Convert File to ArrayBuffer for Dropbox API
    const arrayBuffer = await file.arrayBuffer();
    const fileContent = new Uint8Array(arrayBuffer);

    // Ensure path starts with forward slash and handle spaces
    const sanitizedPath = `/${path.replace(/^\/+/, '')}/${file.name}`.replace(/ /g, '_');

    const response = await dbx.filesUpload({
      path: sanitizedPath,
      contents: fileContent,
      mode: { '.tag': 'overwrite' },
    });
    return response.result;
  } catch (error) {
    console.error('Dropbox upload error:', error);
    if (error.status === 400) {
      throw new Error('Invalid file or path name. Please ensure the file name is valid.');
    }
    throw error;
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