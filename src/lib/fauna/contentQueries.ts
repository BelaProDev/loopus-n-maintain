import { getFaunaClient, fql, handleFaunaError } from './client';
import { ContentData, ToQueryArg } from './types';

export const contentQueries = {
  getAllContent: async () => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(fql`
        contents.all().map(doc => doc.data)
      `);
      return result.data;
    } catch (error) {
      return handleFaunaError(error, []);
    }
  },

  getContent: async (key: string, language: string = 'en') => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(fql`
        contents.firstWhere(.key == ${key} && .language == ${language})
      `);
      return result.data;
    } catch (error) {
      return handleFaunaError(error, null);
    }
  },

  updateContent: async (data: ContentData) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const queryData: ToQueryArg<ContentData> = { ...data };
      const result = await client.query(fql`
        let doc = contents.firstWhere(.key == ${data.key} && .language == ${data.language})
        if (doc == null) {
          contents.create(${queryData})
        } else {
          doc.update(${queryData})
        }
      `);
      return result;
    } catch (error) {
      return handleFaunaError(error, null);
    }
  }
};