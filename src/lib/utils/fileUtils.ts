import { DROPBOX_CONSTANTS } from '../constants/dropbox';
import type { MediaType } from '@/types/dropbox';

export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

export const getMediaType = (fileName: string): MediaType => {
  const extension = getFileExtension(fileName);
  
  if (DROPBOX_CONSTANTS.FILE_TYPES.IMAGE.includes(extension)) return 'image';
  if (DROPBOX_CONSTANTS.FILE_TYPES.VIDEO.includes(extension)) return 'video';
  if (DROPBOX_CONSTANTS.FILE_TYPES.AUDIO.includes(extension)) return 'audio';
  if (DROPBOX_CONSTANTS.FILE_TYPES.DOCUMENT.includes(extension)) return 'document';
  
  return 'other';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const isValidFileName = (fileName: string): boolean => {
  const invalidChars = /[<>:"/\\|?*\x00-\x1F]/g;
  return !invalidChars.test(fileName);
};