export interface DropboxTokens {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  error?: string;
  isLoading: boolean;
}

export interface AuthResponse {
  tokens: DropboxTokens;
  error?: string;
}