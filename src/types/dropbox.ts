import { files } from 'dropbox';

export type DropboxFileTag = 'file' | 'folder' | 'deleted';

export interface DropboxBaseMetadata {
  '.tag': DropboxFileTag;
  id: string;
  name: string;
  path_lower: string | null;
  path_display?: string;
}

export interface DropboxFile extends DropboxBaseMetadata {
  '.tag': 'file';
  size: number;
  is_downloadable: boolean;
  client_modified: string;
  server_modified: string;
  rev: string;
  content_hash?: string;
}

export interface DropboxFolder extends DropboxBaseMetadata {
  '.tag': 'folder';
}

export interface DropboxDeletedFile extends DropboxBaseMetadata {
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