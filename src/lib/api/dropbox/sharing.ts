import { Dropbox } from 'dropbox';
import { DropboxSharedLinkMetadata, DropboxSharedLinkSettings } from '@/types/dropbox';

export class DropboxSharingOperations {
  constructor(private client: Dropbox) {}

  async createSharedLink(path: string, settings?: DropboxSharedLinkSettings): Promise<DropboxSharedLinkMetadata> {
    const response = await this.client.sharingCreateSharedLinkWithSettings({
      path,
      settings: settings || {
        requested_visibility: { '.tag': 'public' },
        audience: { '.tag': 'public' },
        access: { '.tag': 'viewer' }
      }
    });
    return response.result;
  }

  async listSharedLinks(path?: string): Promise<DropboxSharedLinkMetadata[]> {
    const response = await this.client.sharingListSharedLinks({
      path: path || '',
      direct_only: true
    });
    return response.result.links;
  }

  async revokeSharedLink(url: string): Promise<void> {
    await this.client.sharingRevokeSharedLink({ url });
  }

  async addFolderMember(path: string, members: { email: string; accessLevel: 'viewer' | 'editor' }[]): Promise<void> {
    await this.client.sharingAddFolderMember({
      shared_folder_id: path,
      members: members.map(member => ({
        member: {
          '.tag': 'email',
          email: member.email
        },
        access_level: { '.tag': member.accessLevel }
      }))
    });
  }

  async removeFolderMember(path: string, member: { email: string }): Promise<void> {
    await this.client.sharingRemoveFolderMember({
      shared_folder_id: path,
      member: {
        '.tag': 'email',
        email: member.email
      },
      leave_a_copy: false
    });
  }
}