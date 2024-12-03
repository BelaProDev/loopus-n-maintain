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

export type DropboxEntryMetadata = DropboxFileMetadata | DropboxFolderMetadata;

export interface DropboxUploadSessionCursor {
  session_id: string;
  offset: number;
}

export interface DropboxUploadSessionStartResult {
  session_id: string;
}