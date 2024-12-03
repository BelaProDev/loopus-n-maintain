import { Dropbox } from 'dropbox';
import { dropboxAuth } from '@/lib/auth/dropboxAuth';
import { 
  DropboxEntry,
  DropboxFile,
  DropboxFolder,
  DropboxSearchResponse,
  DropboxListFolderResult,
  files,
  DropboxSharedLinkSettings,
  DropboxSharedLinkMetadata,
  DropboxFolderMember
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

  private mapFileResponse(entry: any): DropboxEntry {
    const baseMetadata = {
      id: entry.id,
      name: entry.name,
      path_lower: entry.path_lower,
      path_display: entry.path_display,
      '.tag': entry['.tag'] as DropboxEntry['.tag']
    };

    if (entry['.tag'] === 'file') {
      return {
        ...baseMetadata,
        '.tag': 'file' as const,
        size: entry.size,
        is_downloadable: entry.is_downloadable,
        client_modified: entry.client_modified,
        server_modified: entry.server_modified,
        rev: entry.rev,
        content_hash: entry.content_hash
      };
    }

    if (entry['.tag'] === 'folder') {
      return {
        ...baseMetadata,
        '.tag': 'folder' as const
      };
    }

    return {
      ...baseMetadata,
      '.tag': 'deleted' as const
    };
  }

  // Sharing Methods
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

  async listFolder(path: string, recursive: boolean = false): Promise<DropboxEntry[]> {
    const client = await this.getClient();
    try {
      const response = await client.filesListFolder({
        path: path || '',
        recursive,
        include_mounted_folders: true,
        include_non_downloadable_files: true
      });
      return response.result.entries.map(entry => this.mapFileResponse(entry));
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
          file_status: { '.tag': 'active' } as files.FileStatus
        }
      });
      
      return {
        matches: response.result.matches.map(match => ({
          match_type: match.match_type,
          metadata: this.mapFileResponse(match.metadata)
        })),
        more: response.result.has_more,
        start: 0
      };
    } catch (error) {
      console.error('Dropbox search error:', error);
      throw error;
    }
  }
}

export const dropboxClient = DropboxClient.getInstance();
