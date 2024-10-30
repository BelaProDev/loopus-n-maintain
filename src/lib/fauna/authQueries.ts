import { Client, fql } from 'fauna';
import { getFaunaClient, handleFaunaError } from './utils';

export const authQueries = {
  validatePassword: async (password: string) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(fql`
        let settings = Collection.byName("settings")
          .where(.key == "koalax_password")
          .first()
        
        settings.data.value == ${password}
      `);
      return result.data;
    } catch (error) {
      return handleFaunaError(error, false);
    }
  }
};