import { Dropbox, DropboxResponse, files } from 'dropbox';
import { dropboxAuth } from './auth/dropbox';

const getDropboxClient = async () => {
  if (typeof window === 'undefined') return null;
  return dropboxAuth.getClient();
};

const sanitizePath = (path: string) => {
  if (!path || path === '/') return '';
  return path.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');
};

export const uploadFile = async (file: File | Blob, path: string, fileName?: string) => {
  const dbx = await getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  try {
    if (file instanceof File && file.size > 150 * 1024 * 1024) {
      throw new Error('File size exceeds 150MB limit');
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileContent = new Uint8Array(arrayBuffer);
    const cleanFileName = fileName || (file instanceof File ? file.name : 'file');
    const sanitizedFileName = cleanFileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uploadPath = path === '' ? `/${sanitizedFileName}` : `/${sanitizePath(path)}/${sanitizedFileName}`;

    const response = await dbx.filesUpload({
      path: uploadPath,
      contents: fileContent,
      mode: { '.tag': 'overwrite' },
      autorename: true,
      strict_conflict: false,
      mute: false
    });
    return response.result;
  } catch (error) {
    console.error('Dropbox upload error:', error);
    throw error;
  }
};

export const listFiles = async (path: string = '') => {
  const dbx = await getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  const sanitizedPath = sanitizePath(path);
  try {
    const response = await dbx.filesListFolder({
      path: sanitizedPath,
      recursive: false,
      include_mounted_folders: true,
      include_non_downloadable_files: true,
      include_deleted: false,
      include_has_explicit_shared_members: true,
      include_media_info: true
    });
    
    return response.result.entries.map(entry => ({
      ...entry,
      path_display: entry.path_display || entry.path_lower || '',
      name: entry.name || entry.path_display?.split('/').pop() || 'Unnamed'
    }));
  } catch (error) {
    if ((error as any)?.status === 409) {
      return [];
    }
    throw error;
  }
};

export const searchFiles = async (query: string) => {
  const dbx = await getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  const response = await dbx.filesSearchV2({
    query,
    options: {
      path: '',
      max_results: 20,
      file_status: { '.tag': 'active' } as files.SearchOptions['file_status'],
      filename_only: false
    }
  });
  return response.result;
};

export const getFileMetadata = async (path: string) => {
  const dbx = await getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  const response = await dbx.filesGetMetadata({
    path,
    include_media_info: true,
    include_deleted: false,
    include_has_explicit_shared_members: true
  });
  return response.result;
};

export const createSharedLink = async (path: string) => {
  const dbx = await getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  const response = await dbx.sharingCreateSharedLinkWithSettings({
    path,
    settings: {
      requested_visibility: { '.tag': 'public' },
      audience: { '.tag': 'public' },
      access: { '.tag': 'viewer' }
    }
  });
  return response.result;
};

export const moveFile = async (fromPath: string, toPath: string) => {
  const dbx = await getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  const response = await dbx.filesMoveV2({
    from_path: fromPath,
    to_path: toPath,
    autorename: true,
    allow_ownership_transfer: false
  });
  return response.result;
};

export const copyFile = async (fromPath: string, toPath: string) => {
  const dbx = await getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  const response = await dbx.filesCopyV2({
    from_path: fromPath,
    to_path: toPath,
    autorename: true
  });
  return response.result;
};

export const deleteFile = async (path: string) => {
  const dbx = await getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  const response = await dbx.filesDeleteV2({
    path,
  });
  return response.result;
};

export const downloadFile = async (path: string): Promise<Blob> => {
  const dbx = await getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  const response = await dbx.filesDownload({
    path,
  }) as any;
  return response.result.fileBlob;
};

export const createFolder = async (path: string) => {
  const dbx = await getDropboxClient();
  if (!dbx) throw new Error('Dropbox client not initialized');

  const sanitizedPath = `/${sanitizePath(path)}`;
  const response = await dbx.filesCreateFolderV2({
    path: sanitizedPath,
    autorename: true
  });
  return response.result;
};
