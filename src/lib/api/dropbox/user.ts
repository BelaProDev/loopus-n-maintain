import { Dropbox } from 'dropbox';
import type { DropboxUserProfile, SpaceAllocation } from '@/types/dropbox';

export class DropboxUserOperations {
  constructor(private client: Dropbox) {}

  async getCurrentAccount(): Promise<DropboxUserProfile> {
    const response = await this.client.usersGetCurrentAccount();
    const result = response.result;
    
    return {
      account_id: result.account_id,
      name: {
        given_name: result.name.given_name,
        surname: result.name.surname,
        familiar_name: result.name.familiar_name,
        display_name: result.name.display_name,
        abbreviated_name: result.name.abbreviated_name,
      },
      email: result.email,
      email_verified: result.email_verified,
      profile_photo_url: result.profile_photo_url,
    };
  }

  async getSpaceUsage(): Promise<SpaceAllocation> {
    const response = await this.client.usersGetSpaceUsage();
    const result = response.result;
    
    return {
      used: result.used,
      allocation: {
        '.tag': result.allocation['.tag'],
        allocated: 'allocated' in result.allocation ? result.allocation.allocated : 0
      }
    };
  }
}