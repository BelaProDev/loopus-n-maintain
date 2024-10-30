import { getMongoClient, handleMongoError } from './client';
import { ContentDocument } from './types';
import fallbackDb from '../fallback-db.json';

export const contentQueries = {
  getAllContent: async () => {
    try {
      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');
      
      const content = await db.collection<ContentDocument>('contents').find().toArray();
      return content;
    } catch (error) {
      return handleMongoError(error, fallbackDb.content);
    }
  },

  getContent: async (key: string, language: string = 'en') => {
    try {
      const db = await getMongoClient();
      const content = await db.collection<ContentDocument>('contents').findOne({
        key,
        language
      });
      return content || fallbackDb.content.find(c => c.key === key && c.language === language);
    } catch (error) {
      return handleMongoError(
        error,
        fallbackDb.content.find(c => c.key === key && c.language === language)
      );
    }
  },

  updateContent: async (data: ContentDocument) => {
    try {
      const db = await getMongoClient();
      const result = await db.collection<ContentDocument>('contents').updateOne(
        { key: data.key, language: data.language },
        { $set: data },
        { upsert: true }
      );
      return { ref: { id: result.upsertedId?.toString() || '' }, data };
    } catch (error) {
      return handleMongoError(error, {
        ref: { id: `fallback-${Date.now()}` },
        data
      });
    }
  }
};