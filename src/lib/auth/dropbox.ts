const isBrowser = typeof window !== 'undefined';

const DROPBOX_AUTH_URL = "https://www.dropbox.com/oauth2/authorize";
const DROPBOX_TOKEN_URL = "https://api.dropbox.com/oauth2/token";
const REDIRECT_URI = isBrowser ? `${window.location.origin}/koalax/dropbox-callback` : '';
const CLIENT_ID = import.meta.env.VITE_DROPBOX_APP_KEY;

const getStorageValue = (key: string): string | null => {
  if (!isBrowser) return null;
  return localStorage.getItem(key) || sessionStorage.getItem(key);
};

const setStorageValue = (key: string, value: string, persistent = false) => {
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
    if (!isBrowser || !CLIENT_ID) {
      throw new Error('Dropbox client ID not configured');
    }
    
    try {
      const codeVerifier = crypto.randomUUID();
      const encoder = new TextEncoder();
      const data = encoder.encode(codeVerifier);
      const hash = await crypto.subtle.digest('SHA-256', data);
      const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      
      setStorageValue('dropbox_code_verifier', codeVerifier);

      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: 'code',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        token_access_type: 'offline',
        redirect_uri: REDIRECT_URI
      });

      const authUrl = `${DROPBOX_AUTH_URL}?${params.toString()}`;
      window.location.href = authUrl;
      
      return new Promise(() => {});
    } catch (error) {
      console.error('Dropbox auth error:', error);
      throw error;
    }
  },

  async exchangeCodeForToken(code: string) {
    if (!isBrowser || !CLIENT_ID) return null;
    
    const codeVerifier = getStorageValue('dropbox_code_verifier');
    if (!codeVerifier) throw new Error('No code verifier found');

    const params = new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier
    });

    const response = await fetch(DROPBOX_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokens = await response.json();
    setStorageValue('dropbox_tokens', JSON.stringify(tokens), true);
    clearStorageValue('dropbox_code_verifier');
    
    return tokens;
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