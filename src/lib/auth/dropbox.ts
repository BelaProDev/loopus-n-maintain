import { generateRandomString, sha256 } from './utils';

const DROPBOX_AUTH_URL = 'https://www.dropbox.com/oauth2/authorize';
const DROPBOX_TOKEN_URL = 'https://api.dropboxapi.com/oauth2/token';
const REDIRECT_URI = `${window.location.origin}/koalax/dropbox-callback`;

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
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await sha256(codeVerifier);
    
    sessionStorage.setItem('dropbox_code_verifier', codeVerifier);
    
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_DROPBOX_APP_KEY,
      response_type: 'code',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      token_access_type: 'offline',
      redirect_uri: REDIRECT_URI
    });

    const width = 600;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const popup = window.open(
      `${DROPBOX_AUTH_URL}?${params.toString()}`,
      'Dropbox Auth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) {
      throw new Error('Popup blocked. Please allow popups for this site.');
    }

    return new Promise<DropboxTokenResponse>((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          reject(new Error('Authentication cancelled'));
        }
      }, 1000);

      window.addEventListener('message', async (event) => {
        if (event.data?.type === 'DROPBOX_AUTH_CODE') {
          clearInterval(checkClosed);
          popup.close();
          try {
            const response = await this.handleAuthCallback(event.data.code);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  },

  async handleAuthCallback(code: string): Promise<DropboxTokenResponse> {
    const codeVerifier = sessionStorage.getItem('dropbox_code_verifier');
    if (!codeVerifier) {
      throw new Error('No code verifier found');
    }

    const params = new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
      client_id: import.meta.env.VITE_DROPBOX_APP_KEY,
      redirect_uri: REDIRECT_URI
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
    sessionStorage.removeItem('dropbox_code_verifier');
    sessionStorage.setItem('dropbox_tokens', JSON.stringify(data));
    return data;
  },

  async refreshToken(): Promise<DropboxTokenResponse> {
    const tokens = JSON.parse(sessionStorage.getItem('dropbox_tokens') || '{}');
    if (!tokens?.refresh_token) {
      throw new Error('No refresh token found');
    }

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: tokens.refresh_token,
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
    sessionStorage.setItem('dropbox_tokens', JSON.stringify(data));
    return data;
  },

  logout() {
    sessionStorage.removeItem('dropbox_tokens');
    sessionStorage.removeItem('dropbox_code_verifier');
  }
};