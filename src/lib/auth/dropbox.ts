const isBrowser = typeof window !== 'undefined';
const DROPBOX_AUTH_URL = "https://www.dropbox.com/oauth2/authorize";
const DROPBOX_TOKEN_URL = "https://api.dropbox.com/oauth2/token";
const CLIENT_ID = import.meta.env.VITE_DROPBOX_APP_KEY;

const getRedirectUri = () => 
  isBrowser ? `${window.location.origin}/koalax/dropbox-callback` : '';

const getStorageValue = (key: string): string | null => 
  isBrowser ? localStorage.getItem(key) || sessionStorage.getItem(key) : null;

const setStorageValue = (key: string, value: string, persistent = true) => {
  if (!isBrowser) return;
  const storage = persistent ? localStorage : sessionStorage;
  storage.setItem(key, value);
};

const clearStorageValue = (key: string) => {
  if (!isBrowser) return;
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
};

export const dropboxAuth = {
  async initiateAuth() {
    if (!isBrowser || !CLIENT_ID) throw new Error('Dropbox client ID not configured');
    
    const state = crypto.randomUUID();
    setStorageValue('dropbox_state', state, false);

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',  // Changed from 'token' to 'code'
      state,
      redirect_uri: getRedirectUri()
    });

    window.location.href = `${DROPBOX_AUTH_URL}?${params.toString()}`;
  },

  async handleCallback(code: string) {
    if (!code) return null;
    
    const storedState = getStorageValue('dropbox_state');
    clearStorageValue('dropbox_state');
    
    try {
      const response = await fetch(DROPBOX_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          client_id: CLIENT_ID,
          redirect_uri: getRedirectUri(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const data = await response.json();
      setStorageValue('dropbox_tokens', JSON.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      }));

      return data.access_token;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      return null;
    }
  },

  handleRedirect(hash: string) {
    if (!hash) return null;
    
    const params = new URLSearchParams(hash.substring(1));
    const code = params.get('code');
    const state = params.get('state');
    const storedState = getStorageValue('dropbox_state');
    
    if (!state || state !== storedState) {
      throw new Error('Invalid state parameter');
    }
    
    return this.handleCallback(code || '');
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