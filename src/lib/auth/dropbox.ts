const isBrowser = typeof window !== 'undefined';
const DROPBOX_AUTH_URL = "https://www.dropbox.com/oauth2/authorize";
const DROPBOX_TOKEN_URL = "https://api.dropboxapi.com/oauth2/token";
const CLIENT_ID = import.meta.env.VITE_DROPBOX_APP_KEY;
const CLIENT_SECRET = import.meta.env.VITE_DROPBOX_APP_SECRET;

const getRedirectUri = () => 
  isBrowser ? `${window.location.origin}/koalax/dropbox-callback` : '';

const getStorageValue = (key: string): string | null => 
  isBrowser ? localStorage.getItem(key) : null;

const setStorageValue = (key: string, value: string) => {
  if (!isBrowser) return;
  localStorage.setItem(key, value);
};

const clearStorageValue = (key: string) => {
  if (!isBrowser) return;
  localStorage.removeItem(key);
};

export const dropboxAuth = {
  async initiateAuth() {
    if (!isBrowser || !CLIENT_ID) throw new Error('Dropbox client ID not configured');
    
    const state = crypto.randomUUID();
    setStorageValue('dropbox_state', state);

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      token_access_type: 'offline',
      state,
      redirect_uri: getRedirectUri()
    });

    window.location.href = `${DROPBOX_AUTH_URL}?${params.toString()}`;
  },

  async handleCallback(code: string) {
    if (!code || !CLIENT_ID || !CLIENT_SECRET) {
      throw new Error('Missing required auth parameters');
    }
    
    try {
      const formData = new URLSearchParams();
      formData.append('code', code);
      formData.append('grant_type', 'authorization_code');
      formData.append('client_id', CLIENT_ID);
      formData.append('client_secret', CLIENT_SECRET);
      formData.append('redirect_uri', getRedirectUri());

      const response = await fetch(DROPBOX_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error_description || 'Failed to exchange code for token');
      }

      const data = await response.json();
      
      if (!data.access_token) {
        throw new Error('No access token received');
      }

      setStorageValue('dropbox_tokens', JSON.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      }));

      return data.access_token;
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  },

  logout() {
    if (!isBrowser) return;
    clearStorageValue('dropbox_tokens');
  },

  getAccessToken() {
    const tokens = getStorageValue('dropbox_tokens');
    if (!tokens) return null;
    try {
      return JSON.parse(tokens).access_token;
    } catch {
      return null;
    }
  }
};