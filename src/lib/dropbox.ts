import { dropboxAuth } from './auth/dropbox';
import { files } from 'dropbox/types/dropbox_types';

export const uploadFile = async (file: File, path: string) => {
  const client = dropboxAuth.getClient();
  const arrayBuffer = await file.arrayBuffer();
  const response = await client.filesUpload({
    path: `${path}/${file.name}`,
    contents: arrayBuffer,
  });
  return response;
};

export const listFiles = async (path: string) => {
  const client = dropboxAuth.getClient();
  const response = await client.filesListFolder({ path });
  return response.result.entries;
};

export const downloadFile = async (path: string): Promise<Blob> => {
  const client = dropboxAuth.getClient();
  try {
    const response = await client.filesDownload({ path });
    if ('fileBlob' in response.result && response.result.fileBlob instanceof Blob) {
      return response.result.fileBlob;
    }
    throw new Error('File download failed');
  } catch (error) {
    console.error('Download error:', error);
    throw new Error('File download failed');
  }
};

export const deleteFile = async (path: string) => {
  const client = dropboxAuth.getClient();
  const response = await client.filesDeleteV2({ path });
  return response;
};

export const createFolder = async (path: string) => {
  const client = dropboxAuth.getClient();
  const response = await client.filesCreateFolderV2({ path });
  return response;
};