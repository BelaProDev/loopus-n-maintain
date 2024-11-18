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
    
    console.log('Chat Messages Function - Request:', { action, data });

    switch (action) {
      case 'create': {
        if (!data.roomId) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'roomId is required' })
          };
        }

        console.log('Creating message:', data);
        const message = await client.query(fql`
          Messages.create({
            content: ${data.content},
            sender: ${data.sender},
            room: Room.byId(${data.roomId})!,
            createdAt: Time.now()
          })
        `);
        console.log('Message created:', message);

        return {
          statusCode: 200,
          body: JSON.stringify({ data: message })
        };
      }

      case 'list': {
        if (!data.roomId) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'roomId is required' })
          };
        }

        console.log('Listing messages for room:', data.roomId);
        const messages = await client.query(fql`
          Messages.where(.room == Room.byId(${data.roomId})!)
          .order(-.createdAt)
        `);
        console.log('Messages retrieved:', messages);

        // Ensure we always return an array
        const messageArray = Array.isArray(messages.data) ? messages.data : [];

        return {
          statusCode: 200,
          body: JSON.stringify({ data: messageArray })
        };
      }

      default:
        console.log('Invalid action:', action);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
  } catch (error) {
    console.error('Error details:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      })
    };
  }
};