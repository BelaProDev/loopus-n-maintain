import { sanitizePath } from './pathUtils';
import { DropboxEntry, MediaType } from '@/types/dropbox';

export const getMediaType = (filename: string): MediaType => {
  const extension = getFileExtension(filename).toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
    return 'image';
  }
  if (['mp4', 'webm', 'mov', 'avi'].includes(extension)) {
    return 'video';
  }
  if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) {
    return 'audio';
  }
  if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(extension)) {
    return 'document';
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

export const sortFiles = (files: DropboxEntry[]): DropboxEntry[] => {
  return [...files].sort((a, b) => {
    if (a['.tag'] === 'folder' && b['.tag'] !== 'folder') return -1;
    if (a['.tag'] !== 'folder' && b['.tag'] === 'folder') return 1;
    return a.name.localeCompare(b.name);
  });
};