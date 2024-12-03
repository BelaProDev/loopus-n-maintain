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

export interface SpaceAllocation {
  used: number;
  allocation: {
    '.tag': string;
    allocated: number;
  };
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

export interface DropboxSharedLinkSettings {
  requested_visibility?: {
    '.tag': string;
  };
  audience?: {
    '.tag': string;
  };
  access?: {
    '.tag': string;
  };
}

export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'other';

export interface WhatsAppNumbers {
  primary?: string;
  secondary?: string;
}

export interface NavigationLink {
  id: string;
  title: string;
  url: string;
}

export interface ContentData {
  id: string;
  title: string;
  content: string;
}

export interface DropboxTokenData {
  token: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface DropboxContextType {
  client: DropboxClient | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  initialize: (token: string) => Promise<void>;
  connect: () => Promise<void>;
}

export interface DropboxFile {
  id: string;
  name: string;
  path: string;
  type: MediaType;
  size?: number;
  modified?: string;
}