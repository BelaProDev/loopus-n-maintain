import { Handler } from '@netlify/functions';
import { Client, fql } from 'fauna';

const getFaunaClient = () => {
  const secret = process.env.VITE_FAUNA_SECRET_KEY;
  if (!secret) throw new Error('Fauna secret key not found');
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: result.data || [] })
        };
      }

      case 'create': {
        // Validate required fields
        if (!data?.name) {
          return { 
            statusCode: 400, 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              error: 'Room name is required',
              validationErrors: ['name'] 
            }) 
          };
        }

        const name = data.name.trim();
        if (name.length < 3) {
          return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              error: 'Room name must be at least 3 characters long',
              validationErrors: ['name']
            })
          };
        }

        // Check if room with same name exists
        const existingRoom = await client.query(fql`
          chat_rooms.firstWhere(.name == ${name})
        `);

        if (existingRoom) {
          return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              error: 'A room with this name already exists',
              validationErrors: ['name']
            })
          };
        }

        const result = await client.query(fql`
          let newRoom = chat_rooms.create({
            name: ${name},
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            data: result,
            message: 'Room created successfully'
          })
        };
      }

      default:
        return { 
          statusCode: 400, 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid action' }) 
        };
    }
  } catch (error) {
    console.error('Chat rooms error:', error);
    return { 
      statusCode: 500, 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }) 
    };
  }
};