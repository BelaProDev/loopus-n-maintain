import { getFaunaClient, handleFaunaError } from './client';
import { ContentData, ToQueryArg } from './types';
import { fql } from 'fauna';
import fallbackDb from '../fallback-db.json';

export const contentQueries = {
  getAllContent: async () => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(fql`
        let collection = Collection.byName("contents")!
        collection!.documents().map(doc => doc.data)
      `);
      return result.data;
    } catch (error) {
      return handleFaunaError(error, fallbackDb.content);
    }
  },

  getContent: async (key: string, language: string = 'en') => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(fql`
        let collection = Collection.byName("contents")!
        collection!.firstWhere(.data.key == ${key} && .data.language == ${language})
      `);
      return result;
    } catch (error) {
      return handleFaunaError(
        error,
        fallbackDb.content.find(c => c.key === key && c.language === language)
      );
    }
  },

  updateContent: async (data: ContentData) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const queryData: ToQueryArg<ContentData> = { ...data };
      const result = await client.query(fql`
        let collection = Collection.byName("contents")!
        let existing = collection!.firstWhere(.data.key == ${data.key} && .data.language == ${data.language})
        
        if (existing != null) {
          existing.update({ data: ${queryData} })
        } else {
          collection!.create({ data: ${queryData} })
        }
      `);
      return result;
    } catch (error) {
      return handleFaunaError(error, {
        ref: { id: `fallback-${Date.now()}` },
        data
      });
    }
  }
};