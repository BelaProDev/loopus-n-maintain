import { sanitizePath } from './pathUtils';
import { DropboxFile, FileMetadata } from '@/types/dropbox';

/**
 * Converts a Dropbox file entry to our FileMetadata format
 */
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

/**
 * Creates a folder path from segments
 */
export const createFolderPath = (...segments: string[]): string => {
  return sanitizePath(segments.join('/'));
};

/**
 * Gets the parent folder path
 */
export const getParentPath = (path: string): string => {
  const segments = path.split('/').filter(Boolean);
  segments.pop();
  return segments.length ? `/${segments.join('/')}` : '/';
};

/**
 * Gets the file extension
 */
export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
};

/**
 * Checks if a file is an image
 */
export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  return imageExtensions.includes(getFileExtension(filename));
};

/**
 * Formats file size in bytes to human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Sorts files and folders (folders first, then alphabetically)
 */
export const sortFiles = (files: FileMetadata[]): FileMetadata[] => {
  return [...files].sort((a, b) => {
    if (a.isFolder && !b.isFolder) return -1;
    if (!a.isFolder && b.isFolder) return 1;
    return a.name.localeCompare(b.name);
  });
};

/**
 * Validates a file name
 */
export const isValidFileName = (fileName: string): boolean => {
  const invalidChars = /[<>:"/\\|?*\x00-\x1F]/g;
  return !invalidChars.test(fileName) && fileName.trim().length > 0;
};

/**
 * Creates a unique folder name if the name already exists
 */
export const getUniqueFolderName = (existingNames: string[], baseName: string): string => {
  let name = baseName;
  let counter = 1;
  while (existingNames.includes(name)) {
    name = `${baseName} (${counter})`;
    counter++;
  }
  return name;
};