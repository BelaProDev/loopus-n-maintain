import { Dropbox } from 'dropbox';

const DROPBOX_AUTH_URL = "https://www.dropbox.com/oauth2/authorize";
const DROPBOX_TOKEN_URL = "https://api.dropboxapi.com/oauth2/token";
const CLIENT_ID = import.meta.env.VITE_DROPBOX_APP_KEY;
const CLIENT_SECRET = import.meta.env.VITE_DROPBOX_APP_SECRET;

export const dropboxAuth = {
  async getClient(): Promise<Dropbox | null> {
    const accessToken = await this.getValidAccessToken();
    if (!accessToken) return null;
    
    return new Dropbox({ accessToken });
  },

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
    if (!code) throw new Error('Authorization code is required');
    
    try {
      const response = await fetch(DROPBOX_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: CLIENT_ID || '',
          client_secret: CLIENT_SECRET || '',
          redirect_uri: this.getRedirectUri()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for tokens');
      }

      const data = await response.json();
      localStorage.setItem('dropbox_access_token', data.access_token);
      localStorage.setItem('dropbox_refresh_token', data.refresh_token);
      localStorage.setItem('dropbox_token_expiry', String(Date.now() + (data.expires_in * 1000)));
      
      return data.access_token;
    } catch (error) {
      console.error('Auth callback error:', error);
      throw error;
    }
  },

  async refreshToken(refresh_token: string): Promise<string> {
    const response = await fetch(DROPBOX_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
        client_id: CLIENT_ID || '',
        client_secret: CLIENT_SECRET || ''
      })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    localStorage.setItem('dropbox_access_token', data.access_token);
    localStorage.setItem('dropbox_token_expiry', String(Date.now() + (data.expires_in * 1000)));
    
    return data.access_token;
  },

  async getValidAccessToken(): Promise<string | null> {
    const accessToken = localStorage.getItem('dropbox_access_token');
    const refreshToken = localStorage.getItem('dropbox_refresh_token');
    const expiry = localStorage.getItem('dropbox_token_expiry');

    if (!accessToken || !refreshToken) return null;

    if (expiry && Number(expiry) <= Date.now() + 60000) {
      try {
        return await this.refreshToken(refreshToken);
      } catch (error) {
        console.error('Token refresh error:', error);
        return null;
      }
    }

    return accessToken;
  },

  getRedirectUri(): string {
    return `${window.location.origin}/dropbox-explorer/callback`;
  },

  logout() {
    localStorage.removeItem('dropbox_access_token');
    localStorage.removeItem('dropbox_refresh_token');
    localStorage.removeItem('dropbox_token_expiry');
    localStorage.removeItem('dropbox_state');
  }
};