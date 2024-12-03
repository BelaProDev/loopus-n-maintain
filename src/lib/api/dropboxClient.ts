import { DropboxAuthOperations } from './dropbox/auth';
import { DropboxFileOperations } from './dropbox/files';
import { DropboxSharingOperations } from './dropbox/sharing';
import { DropboxUserOperations } from './dropbox/user';
import type { 
  DropboxEntry, 
  DropboxSearchResult, 
  DropboxFileProperty, 
  DropboxTag,
  DropboxResponse 
} from '@/types/dropbox';

class DropboxClient {
  private static instance: DropboxClient;
  private client: any;
  private accessToken: string | null = null;

  auth: DropboxAuthOperations;
  files: DropboxFileOperations;
  sharing: DropboxSharingOperations;
  user: DropboxUserOperations;

  private constructor() {
    this.auth = new DropboxAuthOperations();
    this.files = new DropboxFileOperations();
    this.sharing = new DropboxSharingOperations();
    this.user = new DropboxUserOperations();
  }

  public static getInstance(): DropboxClient {
    if (!DropboxClient.instance) {
      DropboxClient.instance = new DropboxClient();
    }
    return DropboxClient.instance;
  }

  async initialize(accessToken: string): Promise<void> {
    this.accessToken = accessToken;
    // Initialize Dropbox client with access token
    await this.getClient();
  }

  async getClient() {
    if (!this.client && this.accessToken) {
      const { Dropbox } = await import('dropbox');
      this.client = new Dropbox({ accessToken: this.accessToken });
    }
    return this.client;
  }

  isInitialized(): boolean {
    return !!this.accessToken && !!this.client;
  }

  async listFolder(path: string): Promise<DropboxEntry[]> {
    const client = await this.getClient();
    try {
      const response = await client.filesListFolder({ path });
      return response.result.entries.map(this.mapToDropboxEntry);
    } catch (error) {
      console.error('Error listing folder:', error);
      throw error;
    }
  }

  async search(query: string): Promise<DropboxSearchResult> {
    const client = await this.getClient();
    try {
      const response = await client.filesSearchV2({ query });
      return response.result;
    } catch (error) {
      console.error('Error searching:', error);
      throw error;
    }
  }

  async download(path: string): Promise<Blob> {
    const client = await this.getClient();
    try {
      const response = await client.filesDownload({ path });
      return response.result.fileBlob;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  async upload(path: string, contents: ArrayBuffer | Blob): Promise<DropboxEntry> {
    const client = await this.getClient();
    try {
      const response = await client.filesUpload({
        path,
        contents,
        mode: { '.tag': 'add' },
        autorename: true
      });
      return this.mapToDropboxEntry(response.result);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async delete(path: string): Promise<void> {
    const client = await this.getClient();
    try {
      await client.filesDeleteV2({ path });
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  async createFolder(path: string): Promise<DropboxEntry> {
    const client = await this.getClient();
    try {
      const response = await client.filesCreateFolderV2({ path });
      return this.mapToDropboxEntry(response.result.metadata);
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }

  async getTags(path: string): Promise<DropboxTag[]> {
    const client = await this.getClient();
    try {
      const response = await client.filesTagsGet({ paths: [path] }) as DropboxResponse<{
        entries?: Array<{ tags?: DropboxTag[] }>;
      }>;
      
      if (!response.result.entries?.[0]?.tags) {
        return [];
      }
      
      return response.result.entries[0].tags;
    } catch (error) {
      console.error('Error getting tags:', error);
      return [];
    }
  }

  private mapToDropboxEntry(entry: any): DropboxEntry {
    return {
      id: entry.id || entry.path_lower || entry.path_display,
      name: entry.name,
      path_lower: entry.path_lower,
      path_display: entry.path_display,
      '.tag': entry['.tag'],
      size: entry.size,
      is_downloadable: entry.is_downloadable,
      client_modified: entry.client_modified,
      server_modified: entry.server_modified,
      rev: entry.rev,
      content_hash: entry.content_hash
    };
  }
}

export default DropboxClient;