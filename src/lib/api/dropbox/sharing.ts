import { Dropbox } from 'dropbox';
import type { DropboxSharedLinkMetadata, DropboxSharedLinkSettings } from '@/types/dropbox';

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

    return {
      url: response.result.url,
      name: response.result.name,
      path_lower: response.result.path_lower,
      link_permissions: {
        can_revoke: response.result.link_permissions.can_revoke,
        resolved_visibility: {
          '.tag': response.result.link_permissions.resolved_visibility['.tag']
        },
        revoke_failure_reason: response.result.link_permissions.revoke_failure_reason
          ? { '.tag': response.result.link_permissions.revoke_failure_reason['.tag'] }
          : undefined
      },
      client_modified: response.result.client_modified,
      server_modified: response.result.server_modified,
      rev: response.result.rev,
      size: response.result.size
    };
  }

  async listSharedLinks(path?: string): Promise<DropboxSharedLinkMetadata[]> {
    const response = await this.client.sharingListSharedLinks({
      path: path || '',
      direct_only: true
    });

    return response.result.links.map(link => ({
      url: link.url,
      name: link.name,
      path_lower: link.path_lower,
      link_permissions: {
        can_revoke: link.link_permissions.can_revoke,
        resolved_visibility: {
          '.tag': link.link_permissions.resolved_visibility['.tag']
        },
        revoke_failure_reason: link.link_permissions.revoke_failure_reason
          ? { '.tag': link.link_permissions.revoke_failure_reason['.tag'] }
          : undefined
      },
      client_modified: link.client_modified,
      server_modified: link.server_modified,
      rev: link.rev,
      size: link.size
    }));
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