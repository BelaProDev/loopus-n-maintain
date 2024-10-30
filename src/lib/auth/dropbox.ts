import { Dropbox } from 'dropbox';

const DROPBOX_CLIENT_ID = import.meta.env.VITE_DROPBOX_CLIENT_ID;
const DROPBOX_ACCESS_TOKEN = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN;

class DropboxAuth {
  private dbx: Dropbox;

  constructor() {
    this.dbx = new Dropbox({ 
      accessToken: DROPBOX_ACCESS_TOKEN,
      clientId: DROPBOX_CLIENT_ID 
    });
  }

  async initiateAuth() {
    try {
      if (!DROPBOX_ACCESS_TOKEN) {
        throw new Error('Dropbox access token not configured');
      }
      return { access_token: DROPBOX_ACCESS_TOKEN };
    } catch (error) {
      console.error('Dropbox auth error:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('dropbox_access_token');
  }

  getClient() {
    return this.dbx;
  }
}

export const dropboxAuth = new DropboxAuth();