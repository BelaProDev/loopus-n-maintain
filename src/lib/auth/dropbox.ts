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

const storeTokensInServiceWorker = async (tokens: DropboxTokenResponse) => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    const messageChannel = new MessageChannel();
    return new Promise((resolve, reject) => {
      messageChannel.port1.onmessage = (event) => {
        if (event.data.stored) {
          resolve(true);
        } else {
          reject(new Error('Failed to store tokens'));
        }
      };
      navigator.serviceWorker.controller.postMessage(
        {
          type: 'STORE_DROPBOX_TOKENS',
          tokens
        },
        [messageChannel.port2]
      );
    });
  }
  return false;
};

const getTokensFromServiceWorker = async (): Promise<DropboxTokenResponse | null> => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    const messageChannel = new MessageChannel();
    return new Promise((resolve) => {
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.tokens);
      };
      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_DROPBOX_TOKENS' },
        [messageChannel.port2]
      );
    });
  }
  return null;
};

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

    // Open popup window
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

    return new Promise((resolve, reject) => {
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
    
    // Store tokens in service worker instead of localStorage
    await storeTokensInServiceWorker(data);
    return data;
  },

  async refreshToken(): Promise<DropboxTokenResponse> {
    const tokens = await getTokensFromServiceWorker();
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
    await storeTokensInServiceWorker(data);
    return data;
  },

  async getAccessToken(): Promise<string | null> {
    const tokens = await getTokensFromServiceWorker();
    return tokens?.access_token || null;
  },

  logout() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'STORE_DROPBOX_TOKENS',
        tokens: null
      });
    }
    localStorage.removeItem('dropbox_code_verifier');
  }
};