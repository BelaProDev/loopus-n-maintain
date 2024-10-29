import { Client, fql } from 'fauna';
import { SHA256 } from 'crypto-js';
import fallbackDb from './fallback-db.json';

const client = new Client({
  secret: import.meta.env.VITE_FAUNA_SECRET_KEY,
});

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

const handleFaunaError = (error: any, fallbackData: any) => {
  console.error('Fauna DB Error:', error);
  return fallbackData;
};

export const faunaQueries = {
  getAllEmails: async () => {
    try {
      const result = await client.query(fql`
        Collection.byName("emails").all().documents
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
    try {
      const timestamp = Date.now();
      const hashedPassword = data.password ? SHA256(data.password).toString() : undefined;
      
      return await client.query(fql`
        Collection.byName("emails").create({
          data: {
            email: ${data.email},
            name: ${data.name},
            type: ${data.type},
            password: ${hashedPassword},
            createdAt: ${timestamp},
            updatedAt: ${timestamp}
          }
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
    try {
      return await client.query(fql`
        Collection.byName("emails").document(${id}).update({
          data: {
            ...${data},
            updatedAt: ${Date.now()}
          }
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
    try {
      return await client.query(fql`
        Collection.byName("emails").document(${id}).delete()
      `);
    } catch (error) {
      return handleFaunaError(error, { success: true });
    }
  },

  getAllContent: async () => {
    try {
      const result = await client.query(fql`
        Collection.byName("contents").all().documents
      `);
      return result.data;
    } catch (error) {
      return handleFaunaError(error, fallbackDb.content);
    }
  },

  getContent: async (key: string, language: string = 'en') => {
    try {
      const result = await client.query(fql`
        Collection.byName("contents").firstWhere(.data.key == ${key} && .data.language == ${language})
      `);
      return result.data;
    } catch (error) {
      return handleFaunaError(
        error,
        fallbackDb.content.find(c => c.data.key === key && c.data.language === language)
      );
    }
  },

  updateContent: async (data: ContentData) => {
    try {
      return await client.query(fql`
        let collection = Collection.byName("contents")
        let existing = collection.firstWhere(.data.key == ${data.key} && .data.language == ${data.language})
        
        if (existing != null) {
          existing.update({
            data: {
              content: ${data.content},
              lastModified: ${Date.now()},
              modifiedBy: ${data.modifiedBy}
            }
          })
        } else {
          collection.create({
            data: {
              key: ${data.key},
              type: ${data.type},
              content: ${data.content},
              language: ${data.language},
              lastModified: ${Date.now()},
              modifiedBy: ${data.modifiedBy}
            }
          })
        }
      `);
    } catch (error) {
      return handleFaunaError(error, {
        ref: { id: `fallback-${Date.now()}` },
        data: { ...data, lastModified: Date.now() }
      });
    }
  }
};

export { client };
