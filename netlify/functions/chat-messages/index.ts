import { Handler } from '@netlify/functions';
import { Client, fql } from 'fauna';

const client = new Client({
  secret: process.env.FAUNA_SECRET_KEY!
});

export const handler: Handler = async (event) => {
  try {
    const { action, data, roomId } = JSON.parse(event.body || '{}');

    switch (action) {
      case 'list':
        const messages = await client.query(fql`
          chat_messages.all()
          .filter(m => m.roomId == ${roomId})
          .order(-.timestamp)
          .limit(100)
        `);
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, data: messages })
        };

      case 'create':
        const newMessage = await client.query(fql`
          chat_messages.create({
            roomId: ${data.roomId},
            sender: ${data.sender},
            content: ${data.content},
            type: ${data.type},
            timestamp: Time.now()
          })
        `);
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, data: newMessage })
        };

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ success: false, error: 'Invalid action' })
        };
    }
  } catch (error) {
    console.error('Chat messages error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
};