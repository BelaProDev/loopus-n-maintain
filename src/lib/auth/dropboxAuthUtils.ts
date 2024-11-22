import { Dropbox } from 'dropbox';

export interface DropboxTokens {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

export const getStoredTokens = (): DropboxTokens | null => {
  const tokens = localStorage.getItem('dropbox_tokens');
  return tokens ? JSON.parse(tokens) : null;
};

export const storeTokens = (tokens: DropboxTokens) => {
  localStorage.setItem('dropbox_tokens', JSON.stringify(tokens));
  if (tokens.expires_in) {
    localStorage.setItem('dropbox_token_expiry', String(Date.now() + (tokens.expires_in * 1000)));
  }
};

export const clearTokens = () => {
  localStorage.removeItem('dropbox_tokens');
  localStorage.removeItem('dropbox_token_expiry');
  localStorage.removeItem('dropbox_state');
};

export const isTokenExpired = (): boolean => {
  const expiry = localStorage.getItem('dropbox_token_expiry');
  return expiry ? Number(expiry) <= Date.now() : true;
};

export const createDropboxClient = (accessToken: string): Dropbox => {
  return new Dropbox({ accessToken });
};