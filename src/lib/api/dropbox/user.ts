import { Dropbox } from 'dropbox';
import { SpaceAllocation, DropboxUserProfile } from '@/types/dropbox';

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
        abbreviated_name: response.result.name.abbreviated_name,
      },
      email: response.result.email,
      email_verified: response.result.email_verified,
      profile_photo_url: response.result.profile_photo_url,
    };
  }

  async getSpaceUsage(): Promise<SpaceAllocation> {
    const response = await this.client.usersGetSpaceUsage();
    return {
      used: response.result.used,
      allocated: response.result.allocation.allocated || 0,
      '.tag': response.result.allocation['.tag']
    };
  }
}