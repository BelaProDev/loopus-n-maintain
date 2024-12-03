import { files, sharing } from 'dropbox';

export type { files, sharing };

export type DropboxFileTag = 'file' | 'folder' | 'deleted';
export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'other';
export type FileStatus = files.FileStatus;

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
  is_downloadable?: boolean;
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

export interface DropboxSharedLinkSettings {
  requested_visibility?: {
    '.tag': 'public' | 'team_only' | 'password';
  };
  audience?: {
    '.tag': 'public' | 'team' | 'no_one';
  };
  access?: {
    '.tag': 'viewer' | 'editor';
  };
  password?: string;
  expires?: string;
}

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

export interface DropboxFolderMember {
  access_type: {
    '.tag': string;
  };
  user: {
    account_id: string;
    email: string;
    display_name: string;
  };
  permissions: string[];
  is_inherited?: boolean;
}
