export interface DropboxEntry {
  id: string;
  name: string;
  path_lower: string;
  path_display: string;
  '.tag': 'file' | 'folder' | 'deleted';
  size?: number;
  is_downloadable?: boolean;
  client_modified?: string;
  server_modified?: string;
  rev?: string;
  content_hash?: string;
}

export interface DropboxTokenData {
  userId: string;
  refreshToken: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FaunaDocument<T> {
  ref: { id: string };
  data: T;
  ts?: number;
}

export interface FaunaResponse<T> {
  data: Array<FaunaDocument<T>> | FaunaDocument<T>;
}
