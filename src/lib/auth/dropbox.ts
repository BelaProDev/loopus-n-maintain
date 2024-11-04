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
      response_type: 'token',
      token_access_type: 'offline',
      state,
      redirect_uri: getRedirectUri()
    });

    window.location.href = `${DROPBOX_AUTH_URL}?${params.toString()}`;
  },

  handleRedirect(hash: string) {
    if (!hash) return null;
    
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    const state = params.get('state');
    const storedState = getStorageValue('dropbox_state');
    
    if (!state || state !== storedState) {
      throw new Error('Invalid state parameter');
    }
    
    clearStorageValue('dropbox_state');
    
    if (accessToken) {
      setStorageValue('dropbox_tokens', JSON.stringify({ access_token: accessToken }), true);
      return accessToken;
    }
    
    return null;
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