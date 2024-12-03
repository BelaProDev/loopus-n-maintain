import { files } from 'dropbox';

export type DropboxFileTag = 'file' | 'folder' | 'deleted';
export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'other';

export interface DropboxBaseMetadata {
  '.tag': DropboxFileTag;
  id: string;
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

export interface DropboxSharedLinkMetadata {
  url: string;
  name: string;
  path_lower?: string;
  link_permissions: {
    can_revoke: boolean;
    resolved_visibility: {
      '.tag': string;
    };
    revoke_failure_reason?: {
      '.tag': string;
    };
  };
  client_modified?: string;
  server_modified?: string;
  rev?: string;
  size?: number;
}

export interface DropboxTokenData {
  userId: string;
  refreshToken: string;
  lastUpdated: string;
  [key: string]: string; // Index signature for FaunaDB compatibility
}