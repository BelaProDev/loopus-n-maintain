import DropboxClient from './api/dropboxClient';

let instance: DropboxClient | null = null;

export const dropboxClient = {
  getInstance: () => {
    if (!instance) {
      instance = DropboxClient.getInstance();
    }
    return instance;
  }
};

export default DropboxClient;