import { Dropbox } from 'dropbox';
import { DropboxUserProfile, SpaceAllocation } from '@/types/dropbox';

export class DropboxUserOperations {
  constructor(private client: Dropbox) {}

  async getCurrentAccount(): Promise<DropboxUserProfile> {
    const response = await this.client.usersGetCurrentAccount();
    return {
      account_id: response.result.account_id,
      name: {
        given_name: response.result.name.given_name,
        surname: response.result.name.surname,
        familiar_name: response.result.name.familiar_name,
        display_name: response.result.name.display_name,
        abbreviated_name: response.result.name.abbreviated_name
      },
      email: response.result.email,
      email_verified: response.result.email_verified,
      profile_photo_url: response.result.profile_photo_url,
      team: response.result.team ? {
        id: response.result.team.id,
        name: response.result.team.name,
        sharing_policies: {
          shared_folder_member_policy: response.result.team.sharing_policies.shared_folder_member_policy,
          shared_folder_join_policy: response.result.team.sharing_policies.shared_folder_join_policy,
          shared_link_create_policy: response.result.team.sharing_policies.shared_link_create_policy
        }
      } : undefined
    };
  }

  async getSpaceUsage(): Promise<SpaceAllocation> {
    const response = await this.client.usersGetSpaceUsage();
    return {
      used: response.result.used,
      allocated: response.result.allocation.allocated,
      '.tag': response.result.allocation['.tag']
    };
  }
}

export const createDropboxUser = (client: Dropbox) => new DropboxUserOperations(client);