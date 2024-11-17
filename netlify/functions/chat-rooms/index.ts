import { Handler } from '@netlify/functions';
import { Client, fql } from 'fauna';

const getFaunaClient = () => {
  const secret = process.env.FAUNA_SECRET_KEY;
  if (!secret) throw new Error('FAUNA_SECRET_KEY not set');
  return new Client({ secret });
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { action, data } = JSON.parse(event.body || '{}');
    const client = getFaunaClient();

    switch (action) {
      case 'list': {
        const result = await client.query(fql`
          chat_rooms.all() {
            id,
            name,
            topic,
            createdAt
          }
        `);
        
        return {
          statusCode: 200,
          body: JSON.stringify({ data: result.data || [] })
        };
      }

      case 'create': {
        if (!data?.name) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Room name required' }) };
        }

        const result = await client.query(fql`
          chat_rooms.create({
            name: ${data.name},
            topic: ${data.topic || ''},
            createdAt: Time.now()
          })
        `);

        return {
          statusCode: 200,
          body: JSON.stringify({ 
            data: {
              id: result.id,
              name: result.name,
              topic: result.topic,
              createdAt: result.createdAt
            }
          })
        };
      }

      default:
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid action' }) };
    }
  } catch (error) {
    console.error('Chat rooms error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};