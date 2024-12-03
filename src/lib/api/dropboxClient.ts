import { Dropbox } from 'dropbox';
import { dropboxAuth } from '../auth/dropboxAuth';
import { DropboxFileOperations } from './dropbox/files';
import { DropboxSharingOperations } from './dropbox/sharing';
import { DropboxUserOperations } from './dropbox/user';
import type { DropboxEntry, DropboxSearchResult, DropboxFileProperty, DropboxTag } from '@/types/dropbox';

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
  async uploadFile(file: File, path: string): Promise<DropboxEntry> {
    const fileOps = await this.getFileOps();
    const buffer = await file.arrayBuffer();
    return fileOps.uploadFile(`${path}/${file.name}`, buffer);
  }

  async downloadFile(path: string): Promise<Blob> {
    const fileOps = await this.getFileOps();
    return fileOps.downloadFile(path);
  }

  async deleteFile(path: string): Promise<void> {
    const fileOps = await this.getFileOps();
    return fileOps.deleteFile(path);
  }

  async createFolder(path: string): Promise<DropboxEntry> {
    const fileOps = await this.getFileOps();
    return fileOps.createFolder(path);
  }

  async moveFile(fromPath: string, toPath: string): Promise<DropboxEntry> {
    const fileOps = await this.getFileOps();
    return fileOps.moveFile(fromPath, toPath);
  }

  async copyFile(fromPath: string, toPath: string): Promise<DropboxEntry> {
    const fileOps = await this.getFileOps();
    return fileOps.copyFile(fromPath, toPath);
  }

  async listFolder(path: string): Promise<DropboxEntry[]> {
    const fileOps = await this.getFileOps();
    return fileOps.listFolder(path);
  }

  // Search operations
  async search(query: string, path?: string): Promise<DropboxSearchResult> {
    const client = await this.getClient();
    const response = await client.filesSearch({
      path: path || '',
      query,
      mode: { '.tag': 'filename_and_content' },
      max_results: 100
    });

    return {
      matches: response.result.matches.map(match => ({
        metadata: this.fileOps!.mapFileMetadata(match.metadata),
        match_type: { '.tag': match.match_type['.tag'] }
      })),
      more: response.result.more,
      start: response.result.start
    };
  }

  // File properties operations
  async addProperties(path: string, properties: DropboxFileProperty[]): Promise<void> {
    const client = await this.getClient();
    await client.filePropertiesPropertiesAdd({
      path,
      property_groups: [{
        template_id: 'ptid:custom_properties',
        fields: properties.map(prop => ({
          name: prop.name,
          value: prop.value
        }))
      }]
    });
  }

  async removeProperties(path: string, propertyNames: string[]): Promise<void> {
    const client = await this.getClient();
    await client.filePropertiesPropertiesRemove({
      path,
      property_template_ids: propertyNames
    });
  }

  // Tags operations
  async addTags(path: string, tags: string[]): Promise<void> {
    const client = await this.getClient();
    for (const tag of tags) {
      await client.filesTagsAdd({
        path,
        tag_text: tag
      });
    }
  }

  async removeTags(path: string, tags: string[]): Promise<void> {
    const client = await this.getClient();
    for (const tag of tags) {
      await client.filesTagsRemove({
        path,
        tag_text: tag
      });
    }
  }

  async getTags(path: string): Promise<DropboxTag[]> {
    const client = await this.getClient();
    const response = await client.filesTagsGet({ paths: [path] });
    return response.result.entries[0].tags.map(tag => ({
      tag_name: tag.tag_text
    }));
  }
}

export const dropboxClient = DropboxClient.getInstance();
