import { getFaunaClient, handleFaunaError, sanitizeForFauna } from './utils';
import { fql } from 'fauna';
import fallbackDb from '../fallback-db.json';

export interface ContentData {
  key: string;
  type: 'text' | 'textarea' | 'wysiwyg';
  content: string;
  language: string;
  lastModified: number;
  modifiedBy: string;
}

export const contentQueries = {
  getAllContent: async () => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(fql`
        Collection.byName("contents").all().map(doc => doc.data)
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
      return await client.query(fql`
        Collection.byName("contents")
          .where(.data.key == ${key} && .data.language == ${language})
          .first()
      `);
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
      const sanitizedData = sanitizeForFauna(data);
      return await client.query(fql`
        let collection = Collection.byName("contents")
        let doc = collection
          .where(.data.key == ${data.key} && .data.language == ${data.language})
          .first()
        
        if (doc == null) {
          collection.create(${sanitizedData})
        } else {
          doc.update(${sanitizedData})
        }
      `);
    } catch (error) {
      return handleFaunaError(error, { id: `fallback-${Date.now()}`, ...data });
    }
  }
};