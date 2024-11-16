import { Dropbox } from 'dropbox';

const DROPBOX_AUTH_URL = "https://www.dropbox.com/oauth2/authorize";
const CLIENT_ID = import.meta.env.VITE_DROPBOX_APP_KEY;

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expiry: number;
}

export const dropboxAuth = {
  async initiateAuth() {
    if (!CLIENT_ID) throw new Error('Dropbox client ID not configured');
    
    const state = crypto.randomUUID();
    localStorage.setItem('dropbox_state', state);

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      token_access_type: 'offline',
      state,
      redirect_uri: this.getRedirectUri()
    });

    window.location.href = `${DROPBOX_AUTH_URL}?${params.toString()}`;
  },

  async handleCallback(code: string): Promise<string> {
    if (!code) {
      throw new Error('Authorization code is required');
    }
    
    try {
      const response = await fetch('/.netlify/functions/store-dropbox-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to exchange code for tokens');
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Auth callback error:', error);
      throw new Error('Authentication failed. Please try again.');
    }
  },

  async getValidAccessToken(): Promise<string | null> {
    try {
      const response = await fetch('/.netlify/functions/get-dropbox-token');
      if (!response.ok) {
        const error = await response.json();
        if (error.code === 'NO_TOKEN') {
          return null;
        }
        throw new Error(error.message);
      }
      
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Token retrieval error:', error);
      return null;
    }
  },

  async getClient(): Promise<Dropbox | null> {
    const accessToken = await this.getValidAccessToken();
    if (!accessToken) return null;
    return new Dropbox({ accessToken });
  },

  getRedirectUri(): string {
    return `${window.location.origin}/dropbox-explorer/callback`;
  },

  async logout() {
    localStorage.removeItem('dropbox_state');
    try {
      await fetch('/.netlify/functions/store-dropbox-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: null,
          refresh_token: null,
          expiry: 0
        })
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
};