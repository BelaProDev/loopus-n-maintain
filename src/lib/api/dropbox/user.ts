import { Dropbox, users } from 'dropbox';

export class DropboxUserOperations {
  constructor(private client: Dropbox) {}

  async getCurrentAccount(): Promise<users.FullAccount> {
    const response = await this.client.usersGetCurrentAccount();
    return response.result;
  }

  async getAccount(accountId: string): Promise<users.BasicAccount> {
    const response = await this.client.usersGetAccount({ account_id: accountId });
    return response.result;
  }

  async getSpaceUsage(): Promise<users.SpaceUsage> {
    const response = await this.client.usersGetSpaceUsage();
    const spaceUsage = response.result;
    
    // Handle different allocation types
    const allocation = spaceUsage.allocation;
    const used = spaceUsage.used;
    
    return {
      ...spaceUsage,
      allocation: {
        ...allocation,
        // Ensure allocated property exists
        allocated: 'allocated' in allocation ? allocation.allocated : 0
      }
    };
  }
}