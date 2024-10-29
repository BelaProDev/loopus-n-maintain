import { Dropbox, files } from 'dropbox';

const getDropboxClient = () => {
  if (typeof window === 'undefined') return null;
  const token = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN;
  if (!token) {
    throw new Error('Dropbox access token is not configured');
  }
  return new Dropbox({ accessToken: token });
};

const ensureRootFolder = async (dbx: Dropbox) => {
  try {
    await dbx.filesCreateFolderV2({
      path: '/loopusandmaintain',
      autorename: false
    });
  } catch (error: any) {
    // Ignore error if folder already exists
    if (error?.error?.['.tag'] !== 'path_lookup') {
      console.error('Error creating root folder:', error);
    }
  }
};

export const uploadFile = async (file: File, path: string) => {
  const dbx = getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  try {
    await ensureRootFolder(dbx);

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
    await ensureRootFolder(dbx);
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

interface DropboxDownloadResponse extends files.FileMetadata {
  fileBlob: Blob;
}

export const downloadFile = async (path: string): Promise<Blob> => {
  const dbx = getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  try {
    await ensureRootFolder(dbx);
    const sanitizedPath = path.startsWith('/loopusandmaintain') ? path : `/loopusandmaintain/${path}`;
    const response = await dbx.filesDownload({
      path: sanitizedPath,
    });
    const result = response.result as unknown as DropboxDownloadResponse;
    return result.fileBlob;
  } catch (error) {
    console.error('Dropbox download error:', error);
    throw error;
  }
};