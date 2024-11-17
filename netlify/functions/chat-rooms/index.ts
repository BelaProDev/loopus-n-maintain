import { Handler } from '@netlify/functions';
import { Client, fql } from 'fauna';

const getFaunaClient = () => {
  const secret = process.env.FAUNA_SECRET_KEY;
  if (!secret) throw new Error('FAUNA_SECRET_KEY not set');
  return new Client({ secret });
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method not allowed' }) 
    };
  }

  try {
    const { action, data } = JSON.parse(event.body || '{}');
    const client = getFaunaClient();

    switch (action) {
      case 'list': {
        const result = await client.query(fql`
          let rooms = chat_rooms.all()
          {
            data: rooms.map(room => {
              {
                id: room.id,
                name: room.name,
                topic: room.topic || '',
                createdAt: room.createdAt
              }
            })
          }
        `);
        
        return {
          statusCode: 200,
          body: JSON.stringify(result)
        };
      }

      case 'create': {
        if (!data?.name?.trim()) {
          return { 
            statusCode: 400, 
            body: JSON.stringify({ error: 'Room name is required' }) 
          };
        }

        const result = await client.query(fql`
          let newRoom = chat_rooms.create({
            name: ${data.name.trim()},
            topic: ${data.topic?.trim() || ''},
            createdAt: Time.now()
          })
          {
            id: newRoom.id,
            name: newRoom.name,
            topic: newRoom.topic,
            createdAt: newRoom.createdAt
          }
        `);

        return {
          statusCode: 201,
          body: JSON.stringify({ data: result })
        };
      }

      default:
        return { 
          statusCode: 400, 
          body: JSON.stringify({ error: 'Invalid action' }) 
        };
    }
  } catch (error) {
    console.error('Chat rooms error:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }) 
    };
  }
};