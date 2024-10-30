import { generateCodeVerifier, generateCodeChallenge } from "./utils";

const DROPBOX_AUTH_URL = "https://www.dropbox.com/oauth2/authorize";
const DROPBOX_TOKEN_URL = "https://api.dropbox.com/oauth2/token";
const REDIRECT_URI = `${window.location.origin}/koalax/dropbox-callback`;

export const dropboxAuth = {
  async initiateAuth() {
    try {
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      
      // Store code verifier for later use
      sessionStorage.setItem('dropbox_code_verifier', codeVerifier);

      const params = new URLSearchParams({
        client_id: import.meta.env.VITE_DROPBOX_APP_KEY,
        response_type: 'code',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        token_access_type: 'offline',
        redirect_uri: REDIRECT_URI
      });

      const authUrl = `${DROPBOX_AUTH_URL}?${params.toString()}`;
      
      // Open popup centered
      const width = 600;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        authUrl,
        'DropboxAuth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        throw new Error('Failed to open popup');
      }

      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          try {
            if (popup.closed) {
              clearInterval(interval);
              reject(new Error('Authentication cancelled'));
            }

            const tokens = sessionStorage.getItem('dropbox_tokens');
            if (tokens) {
              clearInterval(interval);
              popup.close();
              resolve(JSON.parse(tokens));
            }
          } catch (error) {
            // Handle cross-origin errors silently
          }
        }, 500);
      });
    } catch (error) {
      console.error('Dropbox auth error:', error);
      throw error;
    }
  },

  async exchangeCodeForToken(code: string) {
    const codeVerifier = sessionStorage.getItem('dropbox_code_verifier');
    if (!codeVerifier) {
      throw new Error('No code verifier found');
    }

    const params = new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: import.meta.env.VITE_DROPBOX_APP_KEY,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier
    });

    const response = await fetch(DROPBOX_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokens = await response.json();
    sessionStorage.setItem('dropbox_tokens', JSON.stringify(tokens));
    sessionStorage.removeItem('dropbox_code_verifier');
    return tokens;
  },

  logout() {
    sessionStorage.removeItem('dropbox_tokens');
    sessionStorage.removeItem('dropbox_code_verifier');
  }
};