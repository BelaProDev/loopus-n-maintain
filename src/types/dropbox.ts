export interface DropboxFile {
  id: string;
  name: string;
  path_display?: string;
  path_lower?: string;
  '.tag': 'file' | 'folder' | 'deleted';
  size?: number;
  client_modified?: string;
  server_modified?: string;
  rev?: string;
}

export interface DropboxError extends Error {
  status?: number;
  response?: {
    error?: {
      error_summary?: string;
      error?: {
        '.tag'?: string;
        reason?: {
          '.tag'?: string;
        };
      };
    };
  };
}