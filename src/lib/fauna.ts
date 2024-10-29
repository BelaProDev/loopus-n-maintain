import { Client, fql, QueryArgument } from 'fauna';
import { SHA256 } from 'crypto-js';
import fallbackDb from './fallback-db.json';
import { handleFaunaError, sanitizeForFauna } from './fauna/utils';

const getFaunaClient = () => {
  if (typeof window === 'undefined') return null;
  return new Client({
    secret: import.meta.env.VITE_FAUNA_SECRET_KEY,
  });
};

interface EmailData {
  email: string;
  name: string;
  type: string;
  password?: string;
  createdAt?: number;
  updatedAt?: number;
}

interface ContentData {
  key: string;
  type: 'text' | 'textarea' | 'wysiwyg';
  content: string;
  language: string;
  lastModified: number;
  modifiedBy: string;
}

export const faunaQueries = {
  getAllEmails: async () => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(fql`
        Collection.byName("emails")!.documents().all()
      `);
      return result.data.map((doc: any) => ({
        ref: { id: doc.id },
        data: {
          email: doc.data.email,
          name: doc.data.name,
          type: doc.data.type,
          createdAt: doc.data.createdAt,
          updatedAt: doc.data.updatedAt
        }
      }));
    } catch (error) {
      return handleFaunaError(error, fallbackDb.emails);
    }
  },

  createEmail: async (data: EmailData) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const timestamp = Date.now();
      const hashedPassword = data.password ? SHA256(data.password).toString() : undefined;
      const sanitizedData = sanitizeForFauna({
        email: data.email,
        name: data.name,
        type: data.type,
        password: hashedPassword,
        createdAt: timestamp,
        updatedAt: timestamp
      });
      
      return await client.query(fql`
        Collection.byName("emails")!.create({
          data: ${sanitizedData}
        })
      `);
    } catch (error) {
      return handleFaunaError(error, {
        ref: { id: `fallback-${Date.now()}` },
        data: { ...data, createdAt: Date.now(), updatedAt: Date.now() }
      });
    }
  },

  updateEmail: async (id: string, data: Partial<EmailData>) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const sanitizedData = sanitizeForFauna({
        ...data,
        updatedAt: Date.now()
      });
      
      return await client.query(fql`
        Collection.byName("emails")!.document(${id})!.update({
          data: ${sanitizedData}
        })
      `);
    } catch (error) {
      return handleFaunaError(error, {
        ref: { id },
        data: { ...data, updatedAt: Date.now() }
      });
    }
  },

  deleteEmail: async (id: string) => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      return await client.query(fql`
        Collection.byName("emails")!.document(${id})!.delete()
      `);
    } catch (error) {
      return handleFaunaError(error, { success: true });
    }
  },

  getAllContent: async () => {
    const client = getFaunaClient();
    if (!client) throw new Error('Fauna client not initialized');

    try {
      const result = await client.query(fql`
        Collection.byName("contents")!.documents().all()
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
        Collection.byName("contents")!.firstWhere(.data.key == ${key} && .data.language == ${language})
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
      const sanitizedData = sanitizeForFauna(data);
      return await client.query(fql`
        let collection = Collection.byName("contents")!
        let existing = collection.firstWhere(.data.key == ${data.key} && .data.language == ${data.language})
        
        if (existing != null) {
          existing.update({
            data: ${sanitizedData}
          })
        } else {
          collection.create({
            data: ${sanitizedData}
          })
        }
      `);
    } catch (error) {
      return handleFaunaError(error, {
        ref: { id: `fallback-${Date.now()}` },
        data
      });
    }
  }
};

export { getFaunaClient as client };