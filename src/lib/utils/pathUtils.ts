/**
 * Sanitizes a file path for Dropbox API
 */
export const sanitizePath = (path: string): string => {
  // Remove multiple consecutive slashes and trim slashes from start/end
  const cleanPath = path.replace(/\/+/g, '/').replace(/^\/+|\/+$/g, '');
  // Ensure the path starts with a forward slash for Dropbox API
  return cleanPath ? `/${cleanPath}` : '';
};

/**
 * Sanitizes a filename for Dropbox API
 */
export const sanitizeFileName = (fileName: string): string => {
  return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
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