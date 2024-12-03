import { Dropbox } from 'dropbox';
import { SpaceAllocation } from '@/types/dropbox';

export class DropboxUserOperations {
  constructor(private client: Dropbox) {}

  async getCurrentAccount() {
    const response = await this.client.usersGetCurrentAccount();
    return response.result;
  }

  async getSpaceUsage(): Promise<SpaceAllocation> {
    const response = await this.client.usersGetSpaceUsage();
    return {
      used: response.result.used,
      allocation: response.result.allocation.allocated || 0,
      '.tag': response.result.allocation['.tag']
    };
  }
}