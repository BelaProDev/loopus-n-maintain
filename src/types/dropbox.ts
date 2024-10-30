import { files } from 'dropbox';

export type DropboxTag = 'file' | 'folder' | 'deleted';

export interface BaseDropboxEntry {
  '.tag': DropboxTag;
  name: string;
  path_lower?: string;
  path_display?: string;
  id: string;
}

export interface DropboxFile extends BaseDropboxEntry {
  '.tag': 'file';
  size: number;
  client_modified: string;
  server_modified: string;
  rev: string;
}

export interface DropboxFolder extends BaseDropboxEntry {
  '.tag': 'folder';
}

export interface DropboxDeleted extends BaseDropboxEntry {
  '.tag': 'deleted';
}

export type DropboxEntry = DropboxFile | DropboxFolder | DropboxDeleted;