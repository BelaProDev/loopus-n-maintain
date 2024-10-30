import { Dropbox } from 'dropbox';
import { DropboxEntry, DropboxFile, DropboxFolder, DropboxDeleted } from '@/types/dropbox';
import { withAsyncHandler, retryWithBackoff, createCancelablePromise } from './asyncUtils';

const createDropboxClient = () => {
  const accessToken = localStorage.getItem('dropbox_access_token');
  if (!accessToken) {
    throw new Error('Dropbox access token not found');
  }
  return new Dropbox({ accessToken });
};

export const uploadFile = async (file: File, path: string): Promise<DropboxFile> => {
  const { data, error } = await withAsyncHandler(async () => {
    const client = createDropboxClient();
    const arrayBuffer = await file.arrayBuffer();
    
    const response = await retryWithBackoff(() => 
      client.filesUpload({
        path: `${path}/${file.name}`,
        contents: arrayBuffer,
      })
    );
    
    if (!response?.result) throw new Error('Upload failed: No response data');
    
    return {
      '.tag': 'file',
      ...response.result,
      name: file.name,
    } as DropboxFile;
  });

  if (error) throw error;
  if (!data) throw new Error('Upload failed: No data returned');
  return data;
};

export const listFiles = async (path: string): Promise<DropboxEntry[]> => {
  const { data, error } = await withAsyncHandler(async () => {
    const client = createDropboxClient();
    const response = await retryWithBackoff(() => 
      client.filesListFolder({ path })
    );
    
    if (!response?.result?.entries) throw new Error('List files failed: No entries found');
    
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
  });

  if (error) throw error;
  if (!data) throw new Error('List files failed: No data returned');
  return data;
};

export const downloadFile = async (path: string): Promise<Blob> => {
  const { data, error } = await withAsyncHandler(async () => {
    const client = createDropboxClient();
    const response = await retryWithBackoff(() => 
      client.filesDownload({ path })
    );
    
    if (!response?.result) throw new Error('Download failed: No response data');
    if (!('fileBlob' in response.result) || !(response.result.fileBlob instanceof Blob)) {
      throw new Error('Download failed: Invalid file data');
    }
    
    return response.result.fileBlob;
  });

  if (error) throw error;
  if (!data) throw new Error('Download failed: No data returned');
  return data;
};

export const deleteFile = async (path: string): Promise<DropboxDeleted> => {
  const { data, error } = await withAsyncHandler(async () => {
    const client = createDropboxClient();
    const response = await retryWithBackoff(() => 
      client.filesDeleteV2({ path })
    );
    
    if (!response?.result?.metadata) throw new Error('Delete failed: No metadata returned');
    
    return {
      '.tag': 'deleted',
      ...response.result.metadata,
      name: path.split('/').pop() || '',
    } as DropboxDeleted;
  });

  if (error) throw error;
  if (!data) throw new Error('Delete failed: No data returned');
  return data;
};

export const createFolder = async (path: string): Promise<DropboxFolder> => {
  const { data, error } = await withAsyncHandler(async () => {
    const client = createDropboxClient();
    const response = await retryWithBackoff(() => 
      client.filesCreateFolderV2({ path })
    );
    
    if (!response?.result?.metadata) throw new Error('Create folder failed: No metadata returned');
    
    return {
      '.tag': 'folder',
      ...response.result.metadata,
      name: path.split('/').pop() || '',
    } as DropboxFolder;
  });

  if (error) throw error;
  if (!data) throw new Error('Create folder failed: No data returned');
  return data;
};

export const cancelableOperations = {
  uploadFile: (file: File, path: string) => createCancelablePromise(uploadFile(file, path)),
  listFiles: (path: string) => createCancelablePromise(listFiles(path)),
  downloadFile: (path: string) => createCancelablePromise(downloadFile(path)),
  deleteFile: (path: string) => createCancelablePromise(deleteFile(path)),
  createFolder: (path: string) => createCancelablePromise(createFolder(path)),
};