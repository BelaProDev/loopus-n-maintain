import { Dropbox, DropboxResponse, files } from 'dropbox';
import { dropboxAuth } from '@/lib/auth/dropbox';
import { 
  DropboxFile, 
  DropboxSearchResponse, 
  DropboxUploadResponse 
} from '@/types/dropbox';

class DropboxClient {
  private client: Dropbox | null = null;
  private static instance: DropboxClient;

  private constructor() {}

  static getInstance(): DropboxClient {
    if (!DropboxClient.instance) {
      DropboxClient.instance = new DropboxClient();
    }
    return DropboxClient.instance;
  }

  private async getClient(): Promise<Dropbox> {
    if (!this.client) {
      const accessToken = await dropboxAuth.getValidAccessToken();
      if (!accessToken) {
        throw new Error('Not authenticated with Dropbox');
      }
      this.client = new Dropbox({ accessToken });
    }
    return this.client;
  }

  private mapFileResponse(entry: files.FileMetadataReference | files.FolderMetadataReference): DropboxFile {
    return {
      id: entry.id || entry.path_lower || entry.path_display || '',
      name: entry.name,
      path: entry.path_display || '',
      path_display: entry.path_display,
      path_lower: entry.path_lower,
      '.tag': entry['.tag'],
      size: 'size' in entry ? entry.size : 0,
      isFolder: entry['.tag'] === 'folder',
      lastModified: 'server_modified' in entry ? entry.server_modified : new Date().toISOString(),
      client_modified: 'client_modified' in entry ? entry.client_modified : undefined,
      server_modified: 'server_modified' in entry ? entry.server_modified : undefined,
      rev: 'rev' in entry ? entry.rev : undefined,
      content_hash: 'content_hash' in entry ? entry.content_hash : undefined,
      is_downloadable: 'is_downloadable' in entry ? entry.is_downloadable : undefined
    };
  }

  async listFolder(path: string, recursive: boolean = false): Promise<DropboxFile[]> {
    const client = await this.getClient();
    try {
      const response = await client.filesListFolder({
        path: path || '',
        recursive,
        include_mounted_folders: true,
        include_non_downloadable_files: true
      });
      return response.result.entries.map(this.mapFileResponse);
    } catch (error) {
      console.error('Dropbox listFolder error:', error);
      throw error;
    }
  }

  async uploadFile(file: File, path: string): Promise<DropboxFile> {
    const client = await this.getClient();
    try {
      const response = await client.filesUpload({
        path,
        contents: await file.arrayBuffer(),
        mode: { '.tag': 'overwrite' },
        autorename: true,
        strict_conflict: false
      });
      return this.mapFileResponse(response.result);
    } catch (error) {
      console.error('Dropbox upload error:', error);
      throw error;
    }
  }

  async downloadFile(path: string): Promise<Blob> {
    const client = await this.getClient();
    try {
      const response = await client.filesDownload({ path });
      return (response as any).result.fileBlob;
    } catch (error) {
      console.error('Dropbox download error:', error);
      throw error;
    }
  }

  async deleteFile(path: string): Promise<void> {
    const client = await this.getClient();
    try {
      await client.filesDeleteV2({ path });
    } catch (error) {
      console.error('Dropbox delete error:', error);
      throw error;
    }
  }

  async createFolder(path: string): Promise<DropboxFile> {
    const client = await this.getClient();
    try {
      const response = await client.filesCreateFolderV2({
        path,
        autorename: false
      });
      return this.mapFileResponse(response.result.metadata);
    } catch (error) {
      console.error('Dropbox create folder error:', error);
      throw error;
    }
  }

  async search(query: string, path: string = ''): Promise<DropboxSearchResponse> {
    const client = await this.getClient();
    try {
      const response = await client.filesSearchV2({
        query,
        options: {
          path: path || '',
          max_results: 100,
          file_status: 'active'
        }
      });
      return response.result;
    } catch (error) {
      console.error('Dropbox search error:', error);
      throw error;
    }
  }

  async getFileMetadata(path: string): Promise<DropboxFile> {
    const client = await this.getClient();
    try {
      const response = await client.filesGetMetadata({
        path,
        include_media_info: true
      });
      return this.mapFileResponse(response.result);
    } catch (error) {
      console.error('Dropbox get metadata error:', error);
      throw error;
    }
  }

  async moveFile(fromPath: string, toPath: string): Promise<DropboxFile> {
    const client = await this.getClient();
    try {
      const response = await client.filesMoveV2({
        from_path: fromPath,
        to_path: toPath,
        autorename: true
      });
      return this.mapFileResponse(response.result.metadata);
    } catch (error) {
      console.error('Dropbox move error:', error);
      throw error;
    }
  }

  async copyFile(fromPath: string, toPath: string): Promise<DropboxFile> {
    const client = await this.getClient();
    try {
      const response = await client.filesCopyV2({
        from_path: fromPath,
        to_path: toPath,
        autorename: true
      });
      return this.mapFileResponse(response.result.metadata);
    } catch (error) {
      console.error('Dropbox copy error:', error);
      throw error;
    }
  }
}

export const dropboxClient = DropboxClient.getInstance();