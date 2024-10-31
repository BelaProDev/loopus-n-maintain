const isBrowser = typeof window !== 'undefined';

const DROPBOX_AUTH_URL = "https://www.dropbox.com/oauth2/authorize";
const DROPBOX_TOKEN_URL = "https://api.dropbox.com/oauth2/token";
const CLIENT_ID = import.meta.env.VITE_DROPBOX_APP_KEY;

const getRedirectUri = () => {
  if (!isBrowser) return '';
  const origin = window.location.origin;
  return `${origin}/koalax/dropbox-callback`;
};

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
        redirect_uri: getRedirectUri()
      });

      // For mobile devices, open in same window
      if (window.innerWidth <= 768) {
        window.location.href = `${DROPBOX_AUTH_URL}?${params.toString()}`;
        return new Promise(() => {});
      }

      // For desktop, open in popup
      const width = 600;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const popup = window.open(
        `${DROPBOX_AUTH_URL}?${params.toString()}`,
        'Dropbox Auth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      return new Promise((resolve, reject) => {
        if (!popup) {
          reject(new Error('Popup blocked. Please allow popups and try again.'));
          return;
        }

        const messageHandler = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          if (event.data?.type === 'DROPBOX_AUTH_CODE') {
            window.removeEventListener('message', messageHandler);
            popup.close();
            this.exchangeCodeForToken(event.data.code)
              .then(resolve)
              .catch(reject);
          }
        };

        window.addEventListener('message', messageHandler);
      });
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
      redirect_uri: getRedirectUri(),
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