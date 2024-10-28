import { Client, fql } from 'fauna';

const client = new Client({
  secret: import.meta.env.VITE_FAUNA_SECRET_KEY,
});

interface EmailData {
  email: string;
  name: string;
  type: string;
}

export const faunaQueries = {
  getAllEmails: async () => {
    try {
      const result = await client.query(fql`
        Collection("emails").documents().map(
          function($doc) {
            {
              ref: { id: $doc.id() },
              data: {
                email: $doc.email,
                name: $doc.name,
                type: $doc.type
              }
            }
          }
        )
      `);
      return result.data;
    } catch (error) {
      console.error('Fauna DB Error:', error);
      return [];
    }
  },

  createEmail: async (data: EmailData) => {
    return await client.query(fql`
      Collection("emails").create({
        email: ${data.email},
        name: ${data.name},
        type: ${data.type}
      })
    `);
  },

  updateEmail: async (id: string, data: EmailData) => {
    return await client.query(fql`
      Collection("emails").byId(${id}).update({
        email: ${data.email},
        name: ${data.name},
        type: ${data.type}
      })
    `);
  },

  deleteEmail: async (id: string) => {
    return await client.query(fql`
      Collection("emails").byId(${id}).delete()
    `);
  }
};

export { client };