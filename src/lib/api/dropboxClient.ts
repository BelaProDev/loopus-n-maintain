import { Dropbox } from 'dropbox';
import type { DropboxEntry, DropboxSearchResult } from '@/types/dropbox';

class DropboxClient {
  private static instance: DropboxClient;
  private client: Dropbox | null = null;
  private accessToken: string | null = null;

  private constructor() {}

  public static getInstance(): DropboxClient {
    if (!DropboxClient.instance) {
      DropboxClient.instance = new DropboxClient();
    }
    return DropboxClient.instance;
  }

  async initialize(accessToken: string): Promise<void> {
    this.accessToken = accessToken;
    this.client = new Dropbox({ accessToken });
  }

  isInitialized(): boolean {
    return !!this.accessToken && !!this.client;
  }

  async listFolder(path: string): Promise<DropboxEntry[]> {
    if (!this.client) throw new Error('Client not initialized');
    
    const response = await this.client.filesListFolder({ path });
    return response.result.entries.map(this.mapToDropboxEntry);
  }

  async uploadFile(file: File, path: string): Promise<DropboxEntry> {
    if (!this.client) throw new Error('Client not initialized');
    
    const response = await this.client.filesUpload({
      path,
      contents: await file.arrayBuffer(),
      mode: { '.tag': 'add' },
      autorename: true
    });
    return this.mapToDropboxEntry(response.result);
  }

  async downloadFile(path: string): Promise<Blob> {
    if (!this.client) throw new Error('Client not initialized');
    
    const response = await this.client.filesDownload({ path }) as any;
    return response.result.fileBlob;
  }

  async deleteFile(path: string): Promise<void> {
    if (!this.client) throw new Error('Client not initialized');
    await this.client.filesDeleteV2({ path });
  }

  async createFolder(path: string): Promise<DropboxEntry> {
    if (!this.client) throw new Error('Client not initialized');
    
    const response = await this.client.filesCreateFolderV2({ path });
    return this.mapToDropboxEntry(response.result.metadata);
  }

  async search(query: string): Promise<DropboxSearchResult> {
    if (!this.client) throw new Error('Client not initialized');
    
    const response = await this.client.filesSearchV2({ query });
    return {
      matches: response.result.matches.map(match => ({
        metadata: this.mapToDropboxEntry(match.metadata.metadata)
      })),
      has_more: response.result.has_more,
      cursor: response.result.cursor
    };
  }

  private mapToDropboxEntry(entry: any): DropboxEntry {
    return {
      id: entry.id || entry.path_lower || entry.path_display || crypto.randomUUID(),
      name: entry.name,
      path_lower: entry.path_lower || '',
      path_display: entry.path_display || '',
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