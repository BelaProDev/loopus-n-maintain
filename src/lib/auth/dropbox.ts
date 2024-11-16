const DROPBOX_AUTH_URL = "https://www.dropbox.com/oauth2/authorize";
const CLIENT_ID = import.meta.env.VITE_DROPBOX_APP_KEY;

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
      
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'STORE_DROPBOX_TOKENS',
          tokens: {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expiry: data.expiry
          }
        });
      }

      return data.access_token;
    } catch (error) {
      console.error('Auth callback error:', error);
      throw error;
    }
  },

  async getValidAccessToken(): Promise<string | null> {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
      return null;
    }

    return new Promise((resolve) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        const token = event.data.tokens?.access_token;
        resolve(token || null);
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_DROPBOX_TOKENS' },
        [channel.port2]
      );
    });
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

  async logout() {
    localStorage.removeItem('dropbox_state');
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'STORE_DROPBOX_TOKENS',
        tokens: null
      });
    }
  }
};