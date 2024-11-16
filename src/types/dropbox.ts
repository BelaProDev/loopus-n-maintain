import { files } from 'dropbox';

export type DropboxFileTag = 'file' | 'folder' | 'deleted';

export interface DropboxMetadata extends files.FileMetadataReference {
  '.tag': DropboxFileTag;
  id: string;
  name: string;
  path_lower: string;
  path_display?: string;
  size?: number;
  is_downloadable?: boolean;
  client_modified?: string;
  server_modified?: string;
  rev?: string;
  content_hash?: string;
}

export interface DropboxFile extends DropboxMetadata {
  '.tag': 'file';
}

export interface DropboxFolder extends DropboxMetadata {
  '.tag': 'folder';
}

export interface DropboxDeletedFile extends DropboxMetadata {
  '.tag': 'deleted';
}

export type DropboxEntry = DropboxFile | DropboxFolder | DropboxDeletedFile;

export interface DropboxListFolderResult {
  entries: DropboxEntry[];
  cursor: string;
  has_more: boolean;
}

export interface DropboxSearchMatch {
  match_type: {
    '.tag': string;
  };
  metadata: DropboxEntry;
}

export interface DropboxSearchResponse {
  matches: DropboxSearchMatch[];
  more: boolean;
  start: number;
}

export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'other';