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

export interface DropboxUploadSessionCursor {
  session_id: string;
  offset: number;
}

export interface DropboxUploadSessionStartResult {
  session_id: string;
}

export interface DropboxSearchResult {
  matches: Array<{
    metadata: DropboxEntry;
    match_type: {
      '.tag': string;
    };
  }>;
  more: boolean;
  start: number;
}

export interface DropboxFileProperty {
  name: string;
  value: string;
}

export interface DropboxTag {
  tag_name: string;
}

export interface SpaceAllocation {
  used: number;
  allocation: {
    '.tag': 'individual' | 'team' | 'other';
    allocated?: number;
  };
}

export interface DropboxUserProfile {
  account_id: string;
  name: {
    given_name: string;
    surname: string;
    familiar_name: string;
    display_name: string;
    abbreviated_name: string;
  };
  email: string;
  email_verified: boolean;
  profile_photo_url?: string;
}