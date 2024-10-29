import { Dropbox, files } from 'dropbox';

const dbx = new Dropbox({ 
  accessToken: import.meta.env.VITE_DROPBOX_ACCESS_TOKEN 
});

export const uploadFile = async (file: File, path: string) => {
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

export const downloadFile = async (path: string): Promise<Blob> => {
  try {
    const response = await dbx.filesDownload({
      path: path,
    }) as { result: files.FileMetadata & { fileBlob: Blob } };
    return response.result.fileBlob;
  } catch (error) {
    console.error('Dropbox download error:', error);
    throw error;
  }
};