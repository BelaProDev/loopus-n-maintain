const DROPBOX_AUTH_URL = "https://www.dropbox.com/oauth2/authorize";
const DROPBOX_TOKEN_URL = "https://api.dropboxapi.com/oauth2/token";
const CLIENT_ID = import.meta.env.VITE_DROPBOX_APP_KEY;
const CLIENT_SECRET = import.meta.env.VITE_DROPBOX_APP_SECRET;

interface DropboxTokens {
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
      const tokens: DropboxTokens = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expiry: Date.now() + (data.expires_in * 1000)
      };

      // Store tokens in localStorage
      localStorage.setItem('dropbox_tokens', JSON.stringify(tokens));
      
      // Also store in service worker for background operations
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'STORE_DROPBOX_TOKENS',
          tokens
        });
      }

      return tokens.access_token;
    } catch (error) {
      console.error('Auth callback error:', error);
      throw error;
    }
  },

  async refreshToken(refresh_token: string): Promise<DropboxTokens> {
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
    const tokens: DropboxTokens = {
      access_token: data.access_token,
      refresh_token: data.refresh_token || refresh_token,
      expiry: Date.now() + (data.expires_in * 1000)
    };

    localStorage.setItem('dropbox_tokens', JSON.stringify(tokens));
    return tokens;
  },

  async getValidAccessToken(): Promise<string | null> {
    const tokensStr = localStorage.getItem('dropbox_tokens');
    if (!tokensStr) return null;

    try {
      const tokens: DropboxTokens = JSON.parse(tokensStr);
      
      // If token is expired or about to expire, refresh it
      if (tokens.expiry <= Date.now() + 60000) { // 1 minute buffer
        const newTokens = await this.refreshToken(tokens.refresh_token);
        return newTokens.access_token;
      }
      
      return tokens.access_token;
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  },

  async getClient() {
    const accessToken = await this.getValidAccessToken();
    if (!accessToken) return null;
    
    const { Dropbox } = await import('dropbox');
    return new Dropbox({ accessToken });
  },

  getRedirectUri(): string {
    return `${window.location.origin}/dropbox-explorer/callback`;
  },

  logout() {
    localStorage.removeItem('dropbox_tokens');
    localStorage.removeItem('dropbox_state');
    
    // Clear service worker tokens
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'STORE_DROPBOX_TOKENS',
        tokens: null
      });
    }
  }
};