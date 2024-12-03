import { files } from 'dropbox';

export interface DropboxFileMetadata {
  '.tag': 'file';
  id: string;
  name: string;
  path_lower: string;
  path_display: string;
  size: number;
  is_downloadable: boolean;
  client_modified: string;
  server_modified: string;
  rev: string;
  content_hash?: string;
}

export interface DropboxFolderMetadata {
  '.tag': 'folder';
  id: string;
  name: string;
  path_lower: string;
  path_display: string;
}

export interface DropboxSharedLinkMetadata {
  url: string;
  name: string;
  link_permissions: {
    can_revoke: boolean;
    resolved_visibility: {
      '.tag': string;
    };
    revoke_failure_reason?: {
      '.tag': string;
    };
  };
  path_lower?: string;
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

export type DropboxEntryMetadata = DropboxFileMetadata | DropboxFolderMetadata;