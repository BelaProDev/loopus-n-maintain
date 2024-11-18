import { Handler } from '@netlify/functions';
import { Client, fql } from 'fauna';

const getFaunaClient = () => {
  const secret = process.env.VITE_FAUNA_SECRET_KEY;
  if (!secret) throw new Error('VITE_FAUNA_SECRET_KEY not set');
  return new Client({ secret });
};

export const handler: Handler = async (event) => {
  try {
    const client = getFaunaClient();
    const { action, data } = JSON.parse(event.body || '{}');

    switch (action) {
      case 'list':
        const listResult = await client.query(fql`
          rooms.all()
        `);
        return {
          statusCode: 200,
          body: JSON.stringify({ data: listResult.data })
        };

      case 'create':
        const { name, topic } = data;
        const createResult = await client.query(fql`
          rooms.create({
            name: ${name},
            topic: ${topic},
            createdAt: Time.now()
          })
        `);
        return {
          statusCode: 200,
          body: JSON.stringify({ data: createResult.data })
        };

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};