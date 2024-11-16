import { Dropbox } from 'dropbox';

const DROPBOX_AUTH_URL = "https://www.dropbox.com/oauth2/authorize";
const DROPBOX_TOKEN_URL = "https://api.dropboxapi.com/oauth2/token";
const CLIENT_ID = import.meta.env.VITE_DROPBOX_APP_KEY;
const CLIENT_SECRET = import.meta.env.VITE_DROPBOX_APP_SECRET;

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
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
    if (!code || !CLIENT_ID || !CLIENT_SECRET) {
      throw new Error('Missing required auth parameters');
    }
    
    try {
      const tokens = await this.exchangeCodeForTokens(code);
      await this.storeTokens(tokens);
      return tokens.access_token;
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  },

  async refreshAccessToken(refresh_token: string): Promise<TokenResponse> {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      throw new Error('Missing client credentials');
    }

    const response = await fetch(DROPBOX_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    return response.json();
  },

  async exchangeCodeForTokens(code: string): Promise<TokenResponse> {
    const response = await fetch(DROPBOX_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: this.getRedirectUri()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    return response.json();
  },

  async storeTokens(tokens: TokenResponse) {
    const expiry = Date.now() + (tokens.expires_in * 1000);
    
    await fetch('/.netlify/functions/store-dropbox-token', {
      method: 'POST',
      body: JSON.stringify({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry
      })
    });
  },

  getRedirectUri(): string {
    return `${window.location.origin}/koalax/dropbox-callback`;
  },

  async getValidAccessToken(): Promise<string | null> {
    try {
      const response = await fetch('/.netlify/functions/get-dropbox-token');
      if (!response.ok) return null;
      
      const data = await response.json();
      if (!data.token) return null;

      if (Date.now() + 300000 > data.expiry) {
        const newTokens = await this.refreshAccessToken(data.refresh_token);
        await this.storeTokens(newTokens);
        return newTokens.access_token;
      }

      return data.token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  async getClient(): Promise<Dropbox | null> {
    const accessToken = await this.getValidAccessToken();
    if (!accessToken) return null;
    return new Dropbox({ accessToken });
  },

  async authenticate() {
    return this.initiateAuth();
  },

  async logout() {
    localStorage.removeItem('dropbox_state');
  }
};