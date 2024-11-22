import { Dropbox } from 'dropbox';
import { toast } from 'sonner';

interface DropboxTokens {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

class DropboxAuthManager {
  private static instance: DropboxAuthManager;
  private client: Dropbox | null = null;
  private accessToken: string | null = null;

  private constructor() {}

  static getInstance(): DropboxAuthManager {
    if (!DropboxAuthManager.instance) {
      DropboxAuthManager.instance = new DropboxAuthManager();
    }
    return DropboxAuthManager.instance;
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
      
      const width = 800;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        authUrl,
        'Dropbox Auth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      return new Promise((resolve, reject) => {
        const handleMessage = async (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data?.type === 'DROPBOX_AUTH_CODE') {
            const { code, state: returnedState } = event.data;
            
            const savedState = localStorage.getItem('dropbox_state');
            if (returnedState !== savedState) {
              reject(new Error('Invalid state parameter'));
              return;
            }

            try {
              const tokenResponse = await fetch('/.netlify/functions/dropbox-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
              });
              
              const tokens: DropboxTokens = await tokenResponse.json();
              
              if ('error' in tokens) {
                throw new Error(tokens.error as string);
              }

              await this.setTokens(tokens);
              window.removeEventListener('message', handleMessage);
              popup.close();
              resolve();
            } catch (error) {
              reject(error);
            }
          }
        };

        window.addEventListener('message', handleMessage);
        
        setTimeout(() => {
          popup.close();
          window.removeEventListener('message', handleMessage);
          reject(new Error('Authentication timeout'));
        }, 300000); // 5 minute timeout
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
      throw error;
    }
  }

  private async setTokens(tokens: DropboxTokens): Promise<void> {
    this.accessToken = tokens.access_token;
    this.client = new Dropbox({ accessToken: tokens.access_token });
    
    localStorage.setItem('dropbox_tokens', JSON.stringify(tokens));
    if (tokens.expires_in) {
      localStorage.setItem('dropbox_token_expiry', String(Date.now() + (tokens.expires_in * 1000)));
    }

    // Verify token immediately
    try {
      await this.client.filesListFolder({ path: '' });
    } catch (error) {
      this.logout();
      throw new Error('Failed to validate access token');
    }
  }

  getClient(): Dropbox | null {
    return this.client;
  }

  isAuthenticated(): boolean {
    const tokens = localStorage.getItem('dropbox_tokens');
    const expiry = localStorage.getItem('dropbox_token_expiry');
    
    if (!tokens || !expiry) return false;
    return Number(expiry) > Date.now();
  }

  logout(): void {
    this.client = null;
    this.accessToken = null;
    localStorage.removeItem('dropbox_tokens');
    localStorage.removeItem('dropbox_token_expiry');
    localStorage.removeItem('dropbox_state');
    toast.success('Successfully logged out from Dropbox');
  }
}

export const dropboxAuth = DropboxAuthManager.getInstance();