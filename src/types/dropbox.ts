export interface DropboxFile {
  id: string;
  name: string;
  path: string;
  path_display?: string;
  path_lower?: string;
  '.tag': 'file' | 'folder' | 'deleted';
  size: number;
  client_modified?: string;
  server_modified?: string;
  rev?: string;
  isFolder: boolean;
  lastModified: string;
}

export interface DropboxResponse {
  entries: DropboxFile[];
  cursor: string;
  has_more: boolean;
}

export interface FileMetadata extends DropboxFile {
  path: string;
  isFolder: boolean;
  lastModified: string;
  size: number;
}

export type MediaType = 'image' | 'video' | 'other';