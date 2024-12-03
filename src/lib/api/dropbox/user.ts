import { Dropbox } from 'dropbox';
import { dropboxAuth } from './auth';

export interface DropboxUserProfile {
  accountId: string;
  email: string;
  displayName: string;
  profilePhotoUrl?: string;
}

class DropboxUserClient {
  private static instance: DropboxUserClient;

  private constructor() {}

  static getInstance(): DropboxUserClient {
    if (!DropboxUserClient.instance) {
      DropboxUserClient.instance = new DropboxUserClient();
    }
    return DropboxUserClient.instance;
  }

  async getCurrentUser(): Promise<DropboxUserProfile | null> {
    const client = await dropboxAuth.getClient();
    if (!client) return null;

    try {
      const response = await client.usersGetCurrentAccount();
      return {
        accountId: response.result.account_id,
        email: response.result.email,
        displayName: response.result.name.display_name,
        profilePhotoUrl: response.result.profile_photo_url
      };
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  }

  async getSpaceUsage(): Promise<{ used: number; allocated: number } | null> {
    const client = await dropboxAuth.getClient();
    if (!client) return null;

    try {
      const response = await client.usersGetSpaceUsage();
      return {
        used: response.result.used,
        allocated: response.result.allocation.allocated
      };
    } catch (error) {
      console.error('Failed to get space usage:', error);
      throw error;
    }
  }

  async setProfilePhoto(photoBlob: Blob): Promise<void> {
    const client = await dropboxAuth.getClient();
    if (!client) return;

    try {
      await client.usersSetProfilePhoto({
        photo: await photoBlob.arrayBuffer()
      });
    } catch (error) {
      console.error('Failed to set profile photo:', error);
      throw error;
    }
  }
}

export const dropboxUser = DropboxUserClient.getInstance();