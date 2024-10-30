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
    
    return {
      '.tag': 'file',
      ...response.result,
      name: file.name,
    } as DropboxFile;
  });

  if (error) throw error;
  return data!;
};

export const listFiles = async (path: string): Promise<DropboxEntry[]> => {
  const { data, error } = await withAsyncHandler(async () => {
    const client = createDropboxClient();
    const response = await retryWithBackoff(() => 
      client.filesListFolder({ path })
    );
    
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
  return data!;
};

export const downloadFile = async (path: string): Promise<Blob> => {
  const { data, error } = await withAsyncHandler(async () => {
    const client = createDropboxClient();
    const response = await retryWithBackoff(() => 
      client.filesDownload({ path })
    );
    
    if ('fileBlob' in response.result && response.result.fileBlob instanceof Blob) {
      return response.result.fileBlob;
    }
    throw new Error('File download failed');
  });

  if (error) throw error;
  return data!;
};

export const deleteFile = async (path: string): Promise<DropboxDeleted> => {
  const { data, error } = await withAsyncHandler(async () => {
    const client = createDropboxClient();
    const response = await retryWithBackoff(() => 
      client.filesDeleteV2({ path })
    );
    
    return {
      '.tag': 'deleted',
      ...response.result.metadata,
      name: path.split('/').pop() || '',
    } as DropboxDeleted;
  });

  if (error) throw error;
  return data!;
};

export const createFolder = async (path: string): Promise<DropboxFolder> => {
  const { data, error } = await withAsyncHandler(async () => {
    const client = createDropboxClient();
    const response = await retryWithBackoff(() => 
      client.filesCreateFolderV2({ path })
    );
    
    return {
      '.tag': 'folder',
      ...response.result.metadata,
      name: path.split('/').pop() || '',
    } as DropboxFolder;
  });

  if (error) throw error;
  return data!;
};

// Export a cancelable version of each operation
export const cancelableOperations = {
  uploadFile: (file: File, path: string) => createCancelablePromise(uploadFile(file, path)),
  listFiles: (path: string) => createCancelablePromise(listFiles(path)),
  downloadFile: (path: string) => createCancelablePromise(downloadFile(path)),
  deleteFile: (path: string) => createCancelablePromise(deleteFile(path)),
  createFolder: (path: string) => createCancelablePromise(createFolder(path)),
};