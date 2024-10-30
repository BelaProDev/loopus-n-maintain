import { getMongoClient, handleMongoError } from './client';
import { ContentDocument } from './types';
import fallbackDb from '../fallback-db.json';

const validateContentDocument = (data: Partial<ContentDocument>): boolean => {
  if (!data.key || !data.content || !data.language) return false;
  if (!['text', 'textarea', 'wysiwyg'].includes(data.type || '')) return false;
  return true;
};

const SUPPORTED_LANGUAGES = ['en', 'fr', 'es'];

export const contentQueries = {
  getAllContent: async (language?: string) => {
    try {
      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');
      
      const query = language ? { 
        language: SUPPORTED_LANGUAGES.includes(language) ? language : 'en' 
      } : {};

      const content = await db.collection('contents')
        .find(query)
        .sort({ key: 1 })
        .toArray();
      return content;
    } catch (error) {
      return handleMongoError(error, fallbackDb.content);
    }
  },

  getContent: async (key: string, language: string = 'en') => {
    try {
      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');

      const usedLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : 'en';
      const content = await db.collection('contents').findOne({
        key,
        language: usedLanguage
      });

      if (!content && usedLanguage !== 'en') {
        // Fallback to English if content not found in requested language
        return await db.collection('contents').findOne({
          key,
          language: 'en'
        });
      }

      return content || fallbackDb.content.find(c => c.key === key && c.language === usedLanguage);
    } catch (error) {
      return handleMongoError(
        error,
        fallbackDb.content.find(c => c.key === key && c.language === language)
      );
    }
  },

  updateContent: async (data: ContentDocument) => {
    try {
      if (!validateContentDocument(data)) {
        throw new Error('Invalid content data');
      }

      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');

      const timestamp = Date.now();
      const contentData = {
        ...data,
        language: SUPPORTED_LANGUAGES.includes(data.language) ? data.language : 'en',
        lastModified: timestamp,
        updatedAt: timestamp
      };

      const result = await db.collection('contents').updateOne(
        { key: data.key, language: contentData.language },
        { $set: contentData },
        { upsert: true }
      );

      return { 
        ref: { id: result.upsertedId?.toString() || '' }, 
        data: contentData 
      };
    } catch (error) {
      return handleMongoError(error, {
        ref: { id: `fallback-${Date.now()}` },
        data
      });
    }
  },

  deleteContent: async (key: string, language: string) => {
    try {
      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');

      const result = await db.collection('contents').deleteOne({ 
        key, 
        language: SUPPORTED_LANGUAGES.includes(language) ? language : 'en' 
      });

      if (result.deletedCount === 0) {
        throw new Error('Content not found');
      }

      return { success: true };
    } catch (error) {
      return handleMongoError(error, { success: false });
    }
  }
};