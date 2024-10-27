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
        Collection.all('emails').map(email => {
          {
            ref: { id: email.id },
            data: {
              email: email.data.email,
              name: email.data.name,
              type: email.data.type
            }
          }
        })
      `);
      return result.data;
    } catch (error) {
      console.error('Fauna DB Error:', error);
      return [];
    }
  },

  createEmail: async (data: EmailData) => {
    return await client.query(fql`
      let doc = Collection.create('emails', {
        data: {
          email: "${data.email}",
          name: "${data.name}",
          type: "${data.type}"
        }
      })
      doc
    `);
  },

  updateEmail: async (id: string, data: EmailData) => {
    return await client.query(fql`
      let doc = Collection.byId('emails', "${id}")
      doc.update({
        data: {
          email: "${data.email}",
          name: "${data.name}",
          type: "${data.type}"
        }
      })
    `);
  },

  deleteEmail: async (id: string) => {
    return await client.query(fql`
      let doc = Collection.byId('emails', "${id}")
      doc.delete()
    `);
  }
};

export { client };