import { Client, fql } from 'fauna';
import { SHA256 } from 'crypto-js';

const client = new Client({
  secret: import.meta.env.VITE_FAUNA_SECRET_KEY,
});

interface EmailData {
  email: string;
  name: string;
  type: string;
  password?: string; // Made optional since not all operations need it
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
      console.error('Fauna DB Error:', error);
      return [];
    }
  },

  createEmail: async (data: EmailData) => {
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
  },

  updateEmail: async (id: string, data: Partial<EmailData>) => {
    return await client.query(fql`
      Collection.byName("emails").document(${id}).update({
        data: {
          ...${data},
          updatedAt: ${Date.now()}
        }
      })
    `);
  },

  deleteEmail: async (id: string) => {
    return await client.query(fql`
      Collection.byName("emails").document(${id}).delete()
    `);
  },

  // Content Management Functions
  getContent: async (key: string, language: string = 'en') => {
    try {
      const result = await client.query(fql`
        Collection.byName("contents").firstWhere(.data.key == ${key} && .data.language == ${language})
      `);
      return result.data;
    } catch {
      return null;
    }
  },

  updateContent: async (data: ContentData) => {
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
  }
};

export { client };