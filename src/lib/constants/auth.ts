export const AUTH_CONSTANTS = {
  DROPBOX_TOKEN_KEY: 'dropbox_tokens',
  DROPBOX_STATE_KEY: 'dropbox_state',
  DROPBOX_EXPIRY_KEY: 'dropbox_token_expiry',
  AUTH_TIMEOUT: 300000, // 5 minutes
} as const;

export const DROPBOX_ENDPOINTS = {
  AUTH: '/.netlify/functions/dropbox-auth',
  TOKEN: 'https://api.dropboxapi.com/oauth2/token',
} as const;