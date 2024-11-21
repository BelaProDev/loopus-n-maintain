import { Dropbox } from 'dropbox';
import { toast } from 'sonner';

export class DropboxAuthManager {
  private static instance: DropboxAuthManager;
  private client: Dropbox | null = null;

  private constructor() {}

  static getInstance(): DropboxAuthManager {
    if (!DropboxAuthManager.instance) {
      DropboxAuthManager.instance = new DropboxAuthManager();
    }
    return DropboxAuthManager.instance;
  }

  getClient(): Dropbox | null {
    return this.client;
  }

  async initializeClient(accessToken: string, expiresIn?: number) {
    this.client = new Dropbox({ accessToken });
    localStorage.setItem('dropboxToken', accessToken);
    
    if (expiresIn) {
      const expiryTime = Date.now() + (expiresIn * 1000);
      localStorage.setItem('dropboxTokenExpiry', expiryTime.toString());
    }
  }

  async connectWithCallback(): Promise<void> {
    const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${
      import.meta.env.VITE_DROPBOX_APP_KEY
    }&response_type=token&redirect_uri=${
      encodeURIComponent(`${window.location.origin}/dropbox-explorer/callback`)
    }&token_access_type=legacy`;

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
        
        if (event.data?.type === 'DROPBOX_AUTH_SUCCESS') {
          const { accessToken } = event.data;
          await this.initializeClient(accessToken);
          window.removeEventListener('message', handleMessage);
          popup.close();
          resolve();
        }
      };

      window.addEventListener('message', handleMessage);
      
      // Set a timeout to close the popup if authentication fails
      setTimeout(() => {
        popup.close();
        window.removeEventListener('message', handleMessage);
        reject(new Error('Authentication timeout'));
      }, 300000); // 5 minutes timeout
    });
  }

  async connectWithOfflineAccess(): Promise<void> {
    const response = await fetch('/.netlify/functions/dropbox-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'initiate' }),
    });
    
    const { authUrl, state } = await response.json();
    
    if (!authUrl) {
      throw new Error('Failed to get authentication URL');
    }

    localStorage.setItem('dropboxAuthState', state);
    
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
          
          const savedState = localStorage.getItem('dropboxAuthState');
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
            
            const tokens = await tokenResponse.json();
            
            if (tokens.error) {
              throw new Error(tokens.error);
            }

            await this.initializeClient(tokens.access_token, tokens.expires_in);
            localStorage.setItem('dropboxRefreshToken', tokens.refresh_token);
            
            window.removeEventListener('message', handleMessage);
            popup.close();
            resolve();
          } catch (error) {
            reject(error);
          }
        }
      };

      window.addEventListener('message', handleMessage);
      
      // Set a timeout to close the popup if authentication fails
      setTimeout(() => {
        popup.close();
        window.removeEventListener('message', handleMessage);
        reject(new Error('Authentication timeout'));
      }, 300000); // 5 minutes timeout
    });
  }

  disconnect(): void {
    this.client = null;
    localStorage.removeItem('dropboxToken');
    localStorage.removeItem('dropboxTokenExpiry');
    localStorage.removeItem('dropboxRefreshToken');
    localStorage.removeItem('dropboxAuthState');
  }
}

export const dropboxAuth = DropboxAuthManager.getInstance();