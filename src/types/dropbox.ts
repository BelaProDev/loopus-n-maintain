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

export interface DropboxContextType {
  client: any | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  initialize: (token: string) => Promise<void>;
  connect: () => Promise<void>;
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
  path_lower: string;
  link_permissions: {
    can_revoke: boolean;
    resolved_visibility: {
      '.tag': 'public' | 'team_only' | 'password' | 'team_and_password' | 'shared_folder_only';
    };
    revoke_failure_reason?: {
      '.tag': string;
    };
  };
}

export interface DropboxSharedLinkSettings {
  requested_visibility?: {
    '.tag': 'public' | 'team_only' | 'password';
  };
  audience?: {
    '.tag': 'public' | 'team';
  };
  access?: {
    '.tag': 'viewer' | 'editor';
  };
}

export interface DropboxSearchResult {
  matches: Array<{
    metadata: DropboxEntry;
  }>;
  has_more: boolean;
  cursor: string;
}

export interface DropboxFile extends DropboxEntry {
  '.tag': 'file';
}

export interface ContentData {
  id: string;
  title: string;
  content: string;
  key: string;
  language: string;
}

export interface DropboxTokenData {
  userId: string;
  refreshToken: string;
  createdAt: string;
  updatedAt?: string;
  [key: string]: any;
}

export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'other';
