import { sanitizePath } from './pathUtils';
import { DropboxFile, FileMetadata, MediaType } from '@/types/dropbox';

export const convertToFileMetadata = (file: any): FileMetadata => ({
  id: file.id || file.path_lower || file.path_display || '',
  name: file.name,
  path: file.path_display || '',
  path_display: file.path_display,
  path_lower: file.path_lower,
  '.tag': file['.tag'],
  size: file.size || 0,
  isFolder: file['.tag'] === 'folder',
  lastModified: file.server_modified || new Date().toISOString(),
  client_modified: file.client_modified,
  server_modified: file.server_modified,
  rev: file.rev
});

export const getMediaType = (filename: string): MediaType => {
  const extension = getFileExtension(filename).toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
    return 'image';
  }
  if (['mp4', 'webm', 'mov', 'avi'].includes(extension)) {
    return 'video';
  }
  return 'other';
};

export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const sortFiles = (files: FileMetadata[]): FileMetadata[] => {
  return [...files].sort((a, b) => {
    if (a.isFolder && !b.isFolder) return -1;
    if (!a.isFolder && b.isFolder) return 1;
    return a.name.localeCompare(b.name);
  });
};