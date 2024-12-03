import { Dropbox } from 'dropbox';
import { toast } from 'sonner';
import { dropboxTokenQueries } from '../fauna/dropboxTokenQueries';

const DROPBOX_AUTH_KEY = 'dropbox_auth';

interface DropboxTokens {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

class DropboxAuthManager {
  private static instance: DropboxAuthManager;
  private client: Dropbox | null = null;

  private constructor() {}

  static getInstance(): DropboxAuthManager {
    if (!DropboxAuthManager.instance) {
      DropboxAuthManager.instance = new DropboxAuthManager();
    }
    return DropboxAuthManager.instance;
  }

  async initializeAuth(): Promise<void> {
    try {
      const response = await fetch('/.netlify/functions/dropbox-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'initiate' }),
      });

      const { authUrl, state } = await response.json();
      if (!authUrl) throw new Error('Failed to get authentication URL');

      localStorage.setItem('dropbox_state', state);
      window.location.href = authUrl;
    } catch (error) {
      toast.error('Failed to initialize Dropbox authentication');
      throw error;
    }
  }

  async handleCallback(code: string, userId: string): Promise<boolean> {
    try {
      const response = await fetch('/.netlify/functions/dropbox-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for tokens');
      }

      const tokens: DropboxTokens = await response.json();
      
      // Store refresh token in FaunaDB if available
      if (tokens.refresh_token) {
        await dropboxTokenQueries.storeToken(userId, tokens.refresh_token);
      }
      
      this.setTokens(tokens);
      toast.success('Successfully connected to Dropbox');
      return true;
    } catch (error) {
      toast.error('Authentication failed');
      throw error;
    }
  }

  async refreshAccessToken(userId: string): Promise<string | null> {
    try {
      const tokenData = await dropboxTokenQueries.getToken(userId);
      if (!tokenData?.refreshToken) return null;

      const response = await fetch('/.netlify/functions/dropbox-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'refresh',
          refresh_token: tokenData.refreshToken 
        }),
      });

      if (!response.ok) throw new Error('Failed to refresh token');

      const tokens: DropboxTokens = await response.json();
      this.setTokens(tokens);
      return tokens.access_token;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }

  async getValidAccessToken(): Promise<string | null> {
    const tokensStr = localStorage.getItem(DROPBOX_AUTH_KEY);
    if (!tokensStr) return null;

    const tokens: DropboxTokens = JSON.parse(tokensStr);
    if (!tokens.access_token) return null;

    const expiry = localStorage.getItem('dropbox_token_expiry');
    if (expiry && Number(expiry) <= Date.now()) {
      return null;
    }

    return tokens.access_token;
  }

  private setTokens(tokens: DropboxTokens): void {
    localStorage.setItem(DROPBOX_AUTH_KEY, JSON.stringify(tokens));
    if (tokens.expires_in) {
      localStorage.setItem(
        'dropbox_token_expiry',
        String(Date.now() + tokens.expires_in * 1000)
      );
    }
    this.client = new Dropbox({ accessToken: tokens.access_token });
  }

  getClient(): Dropbox | null {
    const tokensStr = localStorage.getItem(DROPBOX_AUTH_KEY);
    if (!tokensStr) return null;

    const tokens = JSON.parse(tokensStr);
    if (!this.client && tokens.access_token) {
      this.client = new Dropbox({ accessToken: tokens.access_token });
    }
    return this.client;
  }

  isAuthenticated(): boolean {
    const expiry = localStorage.getItem('dropbox_token_expiry');
    return expiry ? Number(expiry) > Date.now() : false;
  }

  logout(): void {
    localStorage.removeItem(DROPBOX_AUTH_KEY);
    localStorage.removeItem('dropbox_token_expiry');
    localStorage.removeItem('dropbox_state');
    this.client = null;
    toast.success('Logged out from Dropbox');
  }
}

export const dropboxAuth = DropboxAuthManager.getInstance();
