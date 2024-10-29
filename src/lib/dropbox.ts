import { Dropbox, files } from 'dropbox';

const getDropboxClient = () => {
  if (typeof window === 'undefined') return null;
  return new Dropbox({ 
    accessToken: import.meta.env.VITE_DROPBOX_ACCESS_TOKEN 
  });
};

export const uploadFile = async (file: File, path: string) => {
  const dbx = getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  try {
    const response = await dbx.filesUpload({
      path: `/${path}/${file.name}`,
      contents: file,
    });
    return response.result;
  } catch (error) {
    console.error('Dropbox upload error:', error);
    throw error;
  }
};

export const listFiles = async (path: string = '') => {
  const dbx = getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  try {
    const response = await dbx.filesListFolder({
      path: `/${path}`,
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