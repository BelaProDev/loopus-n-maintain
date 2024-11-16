export interface DropboxFile {
  id: string;
  name: string;
  path_display: string;
  '.tag': 'file' | 'folder';
  size?: number;
  client_modified?: string;
  server_modified?: string;
  rev?: string;
}

export interface DropboxResponse {
  entries: DropboxFile[];
  cursor: string;
  has_more: boolean;
}

export interface ExplorerConfig {
  apiEndpoint: string;
  maxUploadSize: number;
  allowedFileTypes: string[];
  thumbnailSizes: {
    small: number;
    medium: number;
    large: number;
  };
}