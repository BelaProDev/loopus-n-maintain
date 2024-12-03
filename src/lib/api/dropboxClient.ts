import { Dropbox } from 'dropbox';
import { dropboxAuth } from './dropbox';
import { DropboxFileOperations } from './dropbox/files';
import { DropboxSharingOperations } from './dropbox/sharing';
import { DropboxUserOperations } from './dropbox/user';
import { DropboxEntryMetadata } from '@/types/dropboxFiles';
import { DropboxSharedLinkMetadata, DropboxSharedLinkSettings } from '@/types/dropbox';

class DropboxClient {
  private static instance: DropboxClient;
  private fileOps: DropboxFileOperations | null = null;
  private sharingOps: DropboxSharingOperations | null = null;
  private userOps: DropboxUserOperations | null = null;

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

  private async getSharingOps(): Promise<DropboxSharingOperations> {
    if (!this.sharingOps) {
      const client = await this.getClient();
      this.sharingOps = new DropboxSharingOperations(client);
    }
    return this.sharingOps;
  }

  private async getUserOps(): Promise<DropboxUserOperations> {
    if (!this.userOps) {
      const client = await this.getClient();
      this.userOps = new DropboxUserOperations(client);
    }
    return this.userOps;
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

  async moveFile(fromPath: string, toPath: string): Promise<DropboxEntryMetadata> {
    const fileOps = await this.getFileOps();
    return fileOps.moveFile(fromPath, toPath);
  }

  async copyFile(fromPath: string, toPath: string): Promise<DropboxEntryMetadata> {
    const fileOps = await this.getFileOps();
    return fileOps.copyFile(fromPath, toPath);
  }

  async listFolder(path: string): Promise<DropboxEntryMetadata[]> {
    const fileOps = await this.getFileOps();
    return fileOps.listFolder(path);
  }

  async createSharedLink(path: string, settings?: DropboxSharedLinkSettings): Promise<DropboxSharedLinkMetadata> {
    const sharingOps = await this.getSharingOps();
    return sharingOps.createSharedLink(path, settings);
  }

  async listSharedLinks(path?: string): Promise<DropboxSharedLinkMetadata[]> {
    const sharingOps = await this.getSharingOps();
    return sharingOps.listSharedLinks(path);
  }

  async revokeSharedLink(url: string): Promise<void> {
    const sharingOps = await this.getSharingOps();
    return sharingOps.revokeSharedLink(url);
  }

  async getCurrentAccount() {
    const userOps = await this.getUserOps();
    return userOps.getCurrentAccount();
  }

  async getSpaceUsage() {
    const userOps = await this.getUserOps();
    return userOps.getSpaceUsage();
  }
}

export const dropboxClient = DropboxClient.getInstance();
