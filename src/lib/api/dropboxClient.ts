import { Dropbox, DropboxResponse, files } from 'dropbox';
import { dropboxAuth } from '@/lib/auth/dropbox';
import { 
  DropboxEntry,
  DropboxFile,
  DropboxFolder,
  DropboxSearchResponse,
  DropboxListFolderResult
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

  private mapFileResponse(entry: files.FileMetadataReference | files.FolderMetadataReference): DropboxEntry {
    const baseMetadata = {
      id: entry.id,
      name: entry.name,
      path_lower: entry.path_lower,
      path_display: entry.path_display,
      '.tag': entry['.tag'] as DropboxEntry['.tag']
    };

    if (entry['.tag'] === 'file') {
      const fileEntry = entry as files.FileMetadataReference;
      return {
        ...baseMetadata,
        '.tag': 'file' as const,
        size: fileEntry.size,
        is_downloadable: fileEntry.is_downloadable,
        client_modified: fileEntry.client_modified,
        server_modified: fileEntry.server_modified,
        rev: fileEntry.rev,
        content_hash: fileEntry.content_hash
      };
    }

    return {
      ...baseMetadata,
      '.tag': 'folder' as const
    };
  }

  async listFolder(path: string, recursive: boolean = false): Promise<DropboxEntry[]> {
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
        path: `${path}/${file.name}`,
        contents: await file.arrayBuffer(),
        mode: { '.tag': 'overwrite' },
        autorename: true
      });
      return this.mapFileResponse(response.result) as DropboxFile;
    } catch (error) {
      console.error('Dropbox upload error:', error);
      throw error;
    }
  }

  async downloadFile(path: string): Promise<Blob> {
    const client = await this.getClient();
    try {
      const response = await client.filesDownload({ path }) as any;
      return response.result.fileBlob;
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

  async createFolder(path: string): Promise<DropboxFolder> {
    const client = await this.getClient();
    try {
      const response = await client.filesCreateFolderV2({
        path,
        autorename: false
      });
      return this.mapFileResponse(response.result.metadata) as DropboxFolder;
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
      
      return {
        matches: response.result.matches.map(match => ({
          match_type: match.match_type,
          metadata: this.mapFileResponse(match.metadata as files.FileMetadataReference)
        })),
        more: response.result.has_more,
        start: 0
      };
    } catch (error) {
      console.error('Dropbox search error:', error);
      throw error;
    }
  }

  async moveFile(fromPath: string, toPath: string): Promise<DropboxEntry> {
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

  async copyFile(fromPath: string, toPath: string): Promise<DropboxEntry> {
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