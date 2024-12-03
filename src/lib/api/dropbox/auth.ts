import { Dropbox } from 'dropbox';
import { toast } from 'sonner';

interface DropboxTokens {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

class DropboxAuthClient {
  private client: Dropbox | null = null;
  private static instance: DropboxAuthClient;

  private constructor() {}

  static getInstance(): DropboxAuthClient {
    if (!DropboxAuthClient.instance) {
      DropboxAuthClient.instance = new DropboxAuthClient();
    }
    return DropboxAuthClient.instance;
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

  async revokeToken(): Promise<void> {
    const client = await this.getClient();
    if (!client) return;

    try {
      await client.authTokenRevoke();
      this.clearTokens();
      toast.success('Successfully disconnected from Dropbox');
    } catch (error) {
      toast.error('Failed to revoke Dropbox access');
      throw error;
    }
  }

  async getClient(): Promise<Dropbox | null> {
    const accessToken = await this.getValidAccessToken();
    if (!accessToken) return null;
    
    if (!this.client) {
      this.client = new Dropbox({ accessToken });
    }
    return this.client;
  }

  private async getValidAccessToken(): Promise<string | null> {
    const tokensStr = localStorage.getItem('dropbox_tokens');
    if (!tokensStr) return null;

    const tokens: DropboxTokens = JSON.parse(tokensStr);
    if (!tokens.access_token) return null;

    const expiry = localStorage.getItem('dropbox_token_expiry');
    if (expiry && Number(expiry) <= Date.now()) {
      return this.refreshToken(tokens.refresh_token);
    }

    return tokens.access_token;
  }

  private async refreshToken(refreshToken?: string): Promise<string | null> {
    if (!refreshToken) return null;

    try {
      const response = await fetch('/.netlify/functions/dropbox-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'refresh',
          refresh_token: refreshToken 
        }),
      });

      const tokens: DropboxTokens = await response.json();
      this.setTokens(tokens);
      return tokens.access_token;
    } catch (error) {
      this.clearTokens();
      return null;
    }
  }

  private setTokens(tokens: DropboxTokens): void {
    localStorage.setItem('dropbox_tokens', JSON.stringify(tokens));
    if (tokens.expires_in) {
      localStorage.setItem(
        'dropbox_token_expiry',
        String(Date.now() + tokens.expires_in * 1000)
      );
    }
  }

  private clearTokens(): void {
    localStorage.removeItem('dropbox_tokens');
    localStorage.removeItem('dropbox_token_expiry');
    localStorage.removeItem('dropbox_state');
    this.client = null;
  }
}

export const dropboxAuth = DropboxAuthClient.getInstance();