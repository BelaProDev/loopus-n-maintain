import { generateRandomString, sha256 } from './utils';

const DROPBOX_AUTH_URL = 'https://www.dropbox.com/oauth2/authorize';
const DROPBOX_TOKEN_URL = 'https://api.dropboxapi.com/oauth2/token';

interface DropboxTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  account_id: string;
  refresh_token?: string;
}

export const dropboxAuth = {
  async initiateAuth() {
    // Generate PKCE values
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await sha256(codeVerifier);
    
    // Store code verifier for later use
    localStorage.setItem('dropbox_code_verifier', codeVerifier);
    
    // Build authorization URL
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_DROPBOX_APP_KEY,
      response_type: 'code',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      token_access_type: 'offline'
    });

    // Redirect to Dropbox auth page
    window.location.href = `${DROPBOX_AUTH_URL}?${params.toString()}`;
  },

  async handleAuthCallback(code: string): Promise<DropboxTokenResponse> {
    const codeVerifier = localStorage.getItem('dropbox_code_verifier');
    if (!codeVerifier) {
      throw new Error('No code verifier found');
    }

    const params = new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
      client_id: import.meta.env.VITE_DROPBOX_APP_KEY
    });

    const response = await fetch(DROPBOX_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    localStorage.removeItem('dropbox_code_verifier');
    
    // Store tokens
    localStorage.setItem('dropbox_access_token', data.access_token);
    if (data.refresh_token) {
      localStorage.setItem('dropbox_refresh_token', data.refresh_token);
    }
    
    return data;
  },

  async refreshToken(): Promise<DropboxTokenResponse> {
    const refreshToken = localStorage.getItem('dropbox_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: import.meta.env.VITE_DROPBOX_APP_KEY
    });

    const response = await fetch(DROPBOX_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    localStorage.setItem('dropbox_access_token', data.access_token);
    return data;
  },

  getAccessToken(): string | null {
    return localStorage.getItem('dropbox_access_token');
  },

  logout() {
    localStorage.removeItem('dropbox_access_token');
    localStorage.removeItem('dropbox_refresh_token');
    localStorage.removeItem('dropbox_code_verifier');
  }
};