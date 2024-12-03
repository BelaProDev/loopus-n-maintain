import { Dropbox } from 'dropbox';
import { dropboxAuth } from './dropbox';
import { DropboxFileOperations } from './dropbox/files';
import { DropboxEntryMetadata, DropboxSharedLinkMetadata } from '@/types/dropboxFiles';
import { DropboxFolderMember } from '@/types/dropbox';

class DropboxClient {
  private static instance: DropboxClient;
  private fileOps: DropboxFileOperations | null = null;

  private constructor() {}

  static getInstance(): DropboxClient {
    if (!DropboxClient.instance) {
      DropboxClient.instance = new DropboxClient();
    }
    return DropboxClient.instance;
  }

  private async getClient(): Promise<Dropbox> {
    const client = await dropboxAuth.getClient();
    if (!client) {
      throw new Error('Not authenticated with Dropbox');
    }
    return client;
  }

  private async getFileOps(): Promise<DropboxFileOperations> {
    if (!this.fileOps) {
      const client = await this.getClient();
      this.fileOps = new DropboxFileOperations(client);
    }
    return this.fileOps;
  }

  // File operations
  async uploadFile(file: File, path: string): Promise<DropboxEntryMetadata> {
    const fileOps = await this.getFileOps();
    const buffer = await file.arrayBuffer();
    return fileOps.uploadFile(`${path}/${file.name}`, buffer);
  }

  async downloadFile(path: string): Promise<Blob> {
    const fileOps = await this.getFileOps();
    return fileOps.downloadFile(path);
  }

  async createFolder(path: string): Promise<DropboxEntryMetadata> {
    const fileOps = await this.getFileOps();
    return fileOps.createFolder(path);
  }

  async deleteFile(path: string): Promise<void> {
    const fileOps = await this.getFileOps();
    return fileOps.deleteFile(path);
  }

  async listFolder(path: string, recursive: boolean = false): Promise<DropboxEntryMetadata[]> {
    const fileOps = await this.getFileOps();
    return fileOps.listFolder(path, recursive);
  }

  async createSharedLink(path: string, settings?: DropboxSharedLinkSettings): Promise<DropboxSharedLinkMetadata> {
    const client = await this.getClient();
    try {
      const response = await client.sharingCreateSharedLinkWithSettings({
        path,
        settings: settings || {
          requested_visibility: { '.tag': 'public' },
          audience: { '.tag': 'public' },
          access: { '.tag': 'viewer' }
        }
      });
      return response.result;
    } catch (error) {
      console.error('Dropbox create shared link error:', error);
      throw error;
    }
  }

  async listSharedLinks(path?: string): Promise<DropboxSharedLinkMetadata[]> {
    const client = await this.getClient();
    try {
      const response = await client.sharingListSharedLinks({
        path: path || '',
        direct_only: true
      });
      return response.result.links;
    } catch (error) {
      console.error('Dropbox list shared links error:', error);
      throw error;
    }
  }

  async revokeSharedLink(url: string): Promise<void> {
    const client = await this.getClient();
    try {
      await client.sharingRevokeSharedLink({ url });
    } catch (error) {
      console.error('Dropbox revoke shared link error:', error);
      throw error;
    }
  }

  async addFolderMember(path: string, members: { email: string; accessLevel: 'viewer' | 'editor' }[]): Promise<void> {
    const client = await this.getClient();
    try {
      await client.sharingAddFolderMember({
        shared_folder_id: path,
        members: members.map(member => ({
          member: {
            '.tag': 'email',
            email: member.email
          },
          access_level: { '.tag': member.accessLevel }
        }))
      });
    } catch (error) {
      console.error('Dropbox add folder member error:', error);
      throw error;
    }
  }

  async listFolderMembers(path: string): Promise<DropboxFolderMember[]> {
    const client = await this.getClient();
    try {
      const response = await client.sharingListFolderMembers({
        shared_folder_id: path
      });
      return response.result.users;
    } catch (error) {
      console.error('Dropbox list folder members error:', error);
      throw error;
    }
  }

  async removeFolderMember(path: string, member: { email: string }): Promise<void> {
    const client = await this.getClient();
    try {
      await client.sharingRemoveFolderMember({
        shared_folder_id: path,
        member: {
          '.tag': 'email',
          email: member.email
        },
        leave_a_copy: false
      });
    } catch (error) {
      console.error('Dropbox remove folder member error:', error);
      throw error;
    }
  }
}

export const dropboxClient = DropboxClient.getInstance();
