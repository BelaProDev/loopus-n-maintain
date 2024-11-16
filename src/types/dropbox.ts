export type DropboxFileTag = 'file' | 'folder' | 'deleted';

export interface DropboxFile {
  id: string;
  name: string;
  path: string;
  path_display?: string;
  path_lower?: string;
  '.tag': DropboxFileTag;
  size: number;
  client_modified?: string;
  server_modified?: string;
  rev?: string;
  isFolder: boolean;
  lastModified: string;
  content_hash?: string;
  sharing_info?: {
    read_only: boolean;
    parent_shared_folder_id: string;
    modified_by: string;
  };
  is_downloadable?: boolean;
}

export interface DropboxResponse {
  entries: DropboxFile[];
  cursor: string;
  has_more: boolean;
}

export interface DropboxError {
  error_summary: string;
  error: {
    '.tag': string;
    [key: string]: any;
  };
}

export interface DropboxUploadResponse {
  name: string;
  path_lower: string;
  path_display: string;
  id: string;
  client_modified: string;
  server_modified: string;
  rev: string;
  size: number;
  is_downloadable: boolean;
  content_hash?: string;
}

export interface DropboxSearchMatch {
  match_type: {
    '.tag': string;
  };
  metadata: DropboxFile;
}

export interface DropboxSearchResponse {
  matches: DropboxSearchMatch[];
  more: boolean;
  start: number;
}

export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'other';