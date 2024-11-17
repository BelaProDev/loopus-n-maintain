import { Handler } from '@netlify/functions';
import { Client, fql } from 'fauna';

const getFaunaClient = () => {
  const secret = process.env.FAUNA_SECRET_KEY;
  if (!secret) {
    throw new Error('FAUNA_SECRET_KEY environment variable is not set');
  }
  return new Client({ secret });
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, error: 'Method not allowed' })
    };
  }

  try {
    const { action, data } = JSON.parse(event.body || '{}');
    const client = getFaunaClient();

    switch (action) {
      case 'list':
        const rooms = await client.query(fql`
          chat_rooms.all()
          .order(-.createdAt)
        `);
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, data: rooms.data })
        };

      case 'create':
        if (!data?.name) {
          return {
            statusCode: 400,
            body: JSON.stringify({ success: false, error: 'Room name is required' })
          };
        }

        const newRoom = await client.query(fql`
          chat_rooms.create({
            name: ${data.name},
            topic: ${data.topic || ''},
            users: [],
            createdAt: Time.now(),
            updatedAt: Time.now(),
            metadata: {
              version: 1,
              isArchived: false
            }
          })
        `);
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, data: newRoom.data })
        };

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ success: false, error: 'Invalid action' })
        };
    }
  } catch (error) {
    console.error('Chat rooms error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
};