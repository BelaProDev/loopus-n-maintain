import { generateRandomString } from './utils';

const DROPBOX_TOKEN_URL = 'https://api.dropboxapi.com/oauth2/token';

interface DropboxTokenResponse {
  access_token: string;
  token_type: string;
}

const storeTokenInServiceWorker = async (token: string) => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    const messageChannel = new MessageChannel();
    return new Promise((resolve, reject) => {
      messageChannel.port1.onmessage = (event) => {
        if (event.data.stored) {
          resolve(true);
        } else {
          reject(new Error('Failed to store token'));
        }
      };
      navigator.serviceWorker.controller.postMessage(
        {
          type: 'STORE_DROPBOX_TOKENS',
          tokens: { access_token: token }
        },
        [messageChannel.port2]
      );
    });
  }
  return false;
};

const getTokenFromServiceWorker = async (): Promise<string | null> => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    const messageChannel = new MessageChannel();
    return new Promise((resolve) => {
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.tokens?.access_token || null);
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
  async initialize() {
    const token = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN;
    if (!token) {
      throw new Error('Dropbox access token is not configured');
    }
    await storeTokenInServiceWorker(token);
    return { access_token: token };
  },

  async getAccessToken(): Promise<string | null> {
    const token = await getTokenFromServiceWorker();
    if (!token) {
      // Try to reinitialize if token is not found
      try {
        const response = await this.initialize();
        return response.access_token;
      } catch {
        return null;
      }
    }
    return token;
  },

  logout() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'STORE_DROPBOX_TOKENS',
        tokens: null
      });
    }
  }
};