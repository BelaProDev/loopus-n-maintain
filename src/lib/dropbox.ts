import { Dropbox } from 'dropbox';
import { dropboxAuth } from './auth/dropbox';
import { sanitizePath, sanitizeFileName } from './utils/pathUtils';

const getDropboxClient = async () => {
  const client = await dropboxAuth.getClient();
  if (!client) throw new Error('Dropbox client not initialized');
  return client;
};