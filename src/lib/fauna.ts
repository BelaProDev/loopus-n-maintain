import { Client, fql } from 'fauna';
import { sha256 } from 'crypto-js';

const client = new Client({
  secret: import.meta.env.VITE_FAUNA_SECRET_KEY,
});

interface EmailData {
  email: string;
  name: string;
  type: string;
  password: string;
  createdAt: number;
  updatedAt: number;
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
        let emails = Collection.byName("emails")
        emails.all().documents
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

  createEmail: async (data: Omit<EmailData, 'createdAt' | 'updatedAt'>) => {
    const timestamp = Date.now();
    const hashedPassword = sha256(data.password).toString();
    
    return await client.query(fql`
      let emails = Collection.byName("emails")
      emails.create({
        email: ${data.email},
        name: ${data.name},
        type: ${data.type},
        password: ${hashedPassword},
        createdAt: ${timestamp},
        updatedAt: ${timestamp}
      })
    `);
  },

  updateEmail: async (id: string, data: Partial<EmailData>) => {
    return await client.query(fql`
      let doc = Collection.byName("emails").document(${id})
      doc.update({
        ...${data},
        updatedAt: ${Date.now()}
      })
    `);
  },

  deleteEmail: async (id: string) => {
    return await client.query(fql`
      let doc = Collection.byName("emails").document(${id})
      doc.delete()
    `);
  },

  // Content Management Functions
  getContent: async (key: string, language: string = 'en') => {
    try {
      const result = await client.query(fql`
        let contents = Collection.byName("contents")
        contents.firstWhere(.key == ${key} && .language == ${language})
      `);
      return result.data;
    } catch {
      return null;
    }
  },

  updateContent: async (data: ContentData) => {
    return await client.query(fql`
      let contents = Collection.byName("contents")
      let existing = contents.firstWhere(.key == ${data.key} && .language == ${data.language})
      
      if (existing != null) {
        existing.update({
          content: ${data.content},
          lastModified: ${Date.now()},
          modifiedBy: ${data.modifiedBy}
        })
      } else {
        contents.create({
          key: ${data.key},
          type: ${data.type},
          content: ${data.content},
          language: ${data.language},
          lastModified: ${Date.now()},
          modifiedBy: ${data.modifiedBy}
        })
      }
    `);
  }
};

export { client };