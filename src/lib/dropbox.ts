import { Dropbox } from 'dropbox';
import { DropboxEntry, DropboxFile, DropboxFolder, DropboxDeleted } from '@/types/dropbox';

const createDropboxClient = () => {
  const accessToken = localStorage.getItem('dropbox_access_token');
  if (!accessToken) {
    throw new Error('Dropbox access token not found');
  }
  return new Dropbox({ accessToken });
};

export const uploadFile = async (file: File, path: string): Promise<DropboxFile> => {
  const client = createDropboxClient();
  const arrayBuffer = await file.arrayBuffer();
  
  const response = await client.filesUpload({
    path: `${path}/${file.name}`,
    contents: arrayBuffer,
  });
  
  return {
    '.tag': 'file',
    ...response.result,
    name: file.name,
  } as DropboxFile;
};

export const listFiles = async (path: string): Promise<DropboxEntry[]> => {
  const client = createDropboxClient();
  const response = await client.filesListFolder({ path });
  
  return response.result.entries.map(entry => {
    const baseEntry = {
      ...entry,
      '.tag': entry['.tag'] as 'file' | 'folder' | 'deleted',
      name: entry.name || '',
    };

    switch (entry['.tag']) {
      case 'file':
        return baseEntry as DropboxFile;
      case 'folder':
        return baseEntry as DropboxFolder;
      default:
        return baseEntry as DropboxDeleted;
    }
  });
};

export const downloadFile = async (path: string): Promise<Blob> => {
  const client = createDropboxClient();
  const response = await client.filesDownload({ path });
  
  if ('fileBlob' in response.result && response.result.fileBlob instanceof Blob) {
    return response.result.fileBlob;
  }
  throw new Error('File download failed');
};

export const deleteFile = async (path: string): Promise<DropboxDeleted> => {
  const client = createDropboxClient();
  const response = await client.filesDeleteV2({ path });
  
  return {
    '.tag': 'deleted',
    ...response.result.metadata,
    name: path.split('/').pop() || '',
  } as DropboxDeleted;
};

export const createFolder = async (path: string): Promise<DropboxFolder> => {
  const client = createDropboxClient();
  const response = await client.filesCreateFolderV2({ path });
  
  return {
    '.tag': 'folder',
    ...response.result.metadata,
    name: path.split('/').pop() || '',
  } as DropboxFolder;
};