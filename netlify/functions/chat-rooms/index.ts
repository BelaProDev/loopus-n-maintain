import { Handler } from '@netlify/functions';
import { Client, fql } from 'fauna';

const client = new Client({
  secret: process.env.FAUNA_SECRET_KEY!
});

export const handler: Handler = async (event) => {
  try {
    const { action, data } = JSON.parse(event.body || '{}');

    switch (action) {
      case 'list':
        const result = await client.query(fql`
          chat_rooms.all()
        `);
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, data: result })
        };

      case 'create':
        const newRoom = await client.query(fql`
          chat_rooms.create({
            name: ${data.name},
            topic: ${data.topic},
            users: [],
            createdAt: Time.now()
          })
        `);
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, data: newRoom })
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