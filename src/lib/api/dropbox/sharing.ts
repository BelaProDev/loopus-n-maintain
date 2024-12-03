import { Dropbox } from 'dropbox';
import type { DropboxSharedLinkMetadata, DropboxSharedLinkSettings } from '@/types/dropbox';

export class DropboxSharingOperations {
  constructor(private client: Dropbox) {}

  async createSharedLink(path: string, settings?: DropboxSharedLinkSettings): Promise<DropboxSharedLinkMetadata> {
    const response = await this.client.sharingCreateSharedLinkWithSettings({
      path,
      settings: {
        requested_visibility: { '.tag': 'public' },
        audience: { '.tag': 'public' },
        access: { '.tag': 'viewer' }
      }
    });

    const result = response.result;
    return {
      url: result.url,
      name: result.name,
      path_lower: result.path_lower,
      link_permissions: {
        can_revoke: result.link_permissions.can_revoke,
        resolved_visibility: {
          '.tag': result.link_permissions.resolved_visibility['.tag'] as 'public' | 'team_only' | 'password' | 'team_and_password' | 'shared_folder_only'
        },
        revoke_failure_reason: result.link_permissions.revoke_failure_reason
          ? { '.tag': result.link_permissions.revoke_failure_reason['.tag'] }
          : undefined
      }
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
          '.tag': link.link_permissions.resolved_visibility['.tag'] as 'public' | 'team_only' | 'password' | 'team_and_password' | 'shared_folder_only'
        },
        revoke_failure_reason: link.link_permissions.revoke_failure_reason
          ? { '.tag': link.link_permissions.revoke_failure_reason['.tag'] }
          : undefined
      }
    }));
  }

  async revokeSharedLink(url: string): Promise<void> {
    await this.client.sharingRevokeSharedLink({ url });
  }
}