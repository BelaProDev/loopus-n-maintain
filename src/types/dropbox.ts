import { files } from 'dropbox';

export type DropboxFileTag = 'file' | 'folder' | 'deleted';
export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'other';

export interface DropboxBaseMetadata {
  '.tag': DropboxFileTag;
  name: string;
  path_lower?: string;
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

export interface DropboxTokenData {
  [key: string]: any;
  userId: string;
  refreshToken: string;
  lastUpdated: string;
}

export interface ContentData {
  key: string;
  language: string;
  [key: string]: any;
}

export interface WhatsAppNumbers {
  number: string;
  name: string;
  id: string;
}