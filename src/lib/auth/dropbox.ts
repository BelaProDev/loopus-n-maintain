import { Dropbox } from 'dropbox';

const DROPBOX_AUTH_URL = "https://www.dropbox.com/oauth2/authorize";
const DROPBOX_TOKEN_URL = "https://api.dropboxapi.com/oauth2/token";
const CLIENT_ID = import.meta.env.VITE_DROPBOX_APP_KEY;
const CLIENT_SECRET = import.meta.env.VITE_DROPBOX_APP_SECRET;
const REDIRECT_URI = `${window.location.origin}/dropbox-explorer/callback`;

class DropboxAuth {
  private static instance: DropboxAuth;
  private tokenRefreshTimeout: NodeJS.Timeout | null = null;
  private refreshPromise: Promise<string> | null = null;

  private constructor() {}

  static getInstance(): DropboxAuth {
    if (!DropboxAuth.instance) {
      DropboxAuth.instance = new DropboxAuth();
    }
    return DropboxAuth.instance;
  }

  async getClient(): Promise<Dropbox | null> {
    const accessToken = await this.getValidAccessToken();
    if (!accessToken) return null;
    
    return new Dropbox({ 
      accessToken,
      clientId: CLIENT_ID
    });
  }

  async initiateAuth() {
    if (!CLIENT_ID) throw new Error('Dropbox client ID not configured');
    
    const state = crypto.randomUUID();
    localStorage.setItem('dropbox_state', state);

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      token_access_type: 'offline',
      state,
      redirect_uri: REDIRECT_URI
    });

    window.location.href = `${DROPBOX_AUTH_URL}?${params.toString()}`;
  }

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
          redirect_uri: REDIRECT_URI
        })
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for tokens');
      }

      const data = await response.json();
      this.saveTokens(data);
      this.scheduleTokenRefresh(data.expires_in);
      
      return data.access_token;
    } catch (error) {
      console.error('Auth callback error:', error);
      throw error;
    }
  }

  private saveTokens(data: any) {
    localStorage.setItem('dropbox_access_token', data.access_token);
    localStorage.setItem('dropbox_refresh_token', data.refresh_token);
    localStorage.setItem('dropbox_token_expiry', String(Date.now() + (data.expires_in * 1000)));
  }

  private scheduleTokenRefresh(expiresIn: number) {
    if (this.tokenRefreshTimeout) {
      clearTimeout(this.tokenRefreshTimeout);
    }

    // Refresh 5 minutes before expiry
    const refreshTime = (expiresIn - 300) * 1000;
    this.tokenRefreshTimeout = setTimeout(() => {
      const refreshToken = localStorage.getItem('dropbox_refresh_token');
      if (refreshToken) {
        this.refreshToken(refreshToken).catch(console.error);
      }
    }, refreshTime);
  }

  async refreshToken(refresh_token: string): Promise<string> {
    // If there's already a refresh in progress, return that promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
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
        this.saveTokens(data);
        this.scheduleTokenRefresh(data.expires_in);
        
        return data.access_token;
      } catch (error) {
        this.logout();
        throw error;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async getValidAccessToken(): Promise<string | null> {
    const accessToken = localStorage.getItem('dropbox_access_token');
    const refreshToken = localStorage.getItem('dropbox_refresh_token');
    const expiry = localStorage.getItem('dropbox_token_expiry');

    if (!accessToken || !refreshToken) return null;

    // If token is expired or will expire in the next minute
    if (expiry && Number(expiry) <= Date.now() + 60000) {
      try {
        return await this.refreshToken(refreshToken);
      } catch (error) {
        console.error('Token refresh error:', error);
        this.logout();
        return null;
      }
    }

    return accessToken;
  }

  logout() {
    if (this.tokenRefreshTimeout) {
      clearTimeout(this.tokenRefreshTimeout);
    }
    localStorage.removeItem('dropbox_access_token');
    localStorage.removeItem('dropbox_refresh_token');
    localStorage.removeItem('dropbox_token_expiry');
    localStorage.removeItem('dropbox_state');
    this.refreshPromise = null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('dropbox_access_token');
  }
}

export const dropboxAuth = DropboxAuth.getInstance();