export interface DropboxEntry {
  id: string;
  name: string;
  path_lower?: string;
  path_display?: string;
  '.tag': 'file' | 'folder' | 'deleted';
  size?: number;
  is_downloadable?: boolean;
  client_modified?: string;
  server_modified?: string;
  rev?: string;
  content_hash?: string;
}

export interface DropboxSearchResult {
  matches: Array<{
    metadata: DropboxEntry;
  }>;
  has_more: boolean;
  cursor?: string;
}

export interface DropboxFileProperty {
  name: string;
  value: string;
}

export interface DropboxTag {
  tag_text: string;
}

export interface DropboxResponse<T> {
  result: T;
  status: number;
}

export interface DropboxError {
  error: {
    '.tag': string;
    message?: string;
  };
  status: number;
}