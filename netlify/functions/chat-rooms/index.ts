import { Handler } from '@netlify/functions';
import { Client, fql } from 'fauna';

const getFaunaClient = () => {
  const secret = process.env.VITE_FAUNA_SECRET_KEY;
  if (!secret) throw new Error('VITE_FAUNA_SECRET_KEY not set');
  return new Client({ secret });
};

export const handler: Handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is required' })
      };
    }

    const client = getFaunaClient();
    const { action, data } = JSON.parse(event.body);
    
    console.log('Chat Rooms Function - Request:', { action, data });

    switch (action) {
      case 'list': {
        console.log('Listing all rooms');
        const listResult = await client.query(fql`
          Room.all()
        `);
        console.log('Rooms retrieved:', listResult);
        return {
          statusCode: 200,
          body: JSON.stringify({ data: listResult.data })
        };
      }

      case 'create': {
        const { name, topic } = data;
        console.log('Creating room:', { name, topic });
        const createResult = await client.query(fql`
          Room.create({
            name: ${name},
            topic: ${topic},
            createdAt: Time.now()
          })
        `);
        console.log('Room created:', createResult);
        return {
          statusCode: 200,
          body: JSON.stringify({ data: createResult })
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