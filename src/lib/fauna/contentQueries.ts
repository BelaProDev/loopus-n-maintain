import { getFaunaClient, fql, handleFaunaError } from './client';
import { ContentData } from '@/types/dropbox';

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
      return result.data as ContentData;
    } catch (error) {
      return handleFaunaError(error, null);
    }
  },

  updateContent: async (data: ContentData) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(fql`
        let doc = contents.firstWhere(.key == ${data.key} && .language == ${data.language})
        if (doc == null) {
          contents.create(${data})
        } else {
          doc.update(${data})
        }
      `);
      return result.data as ContentData;
    } catch (error) {
      return handleFaunaError(error, null);
    }
  }
};