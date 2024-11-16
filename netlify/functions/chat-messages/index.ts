import { Handler } from '@netlify/functions';
import { Client, fql } from 'fauna';

const client = new Client({
  secret: process.env.VITE_FAUNA_SECRET_KEY || '',
});

export const handler: Handler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing request body' })
    };
  }

  try {
    const { action, data } = JSON.parse(event.body);

    switch (action) {
      case 'create':
        const result = await client.query(fql`
          chat_messages.create({
            text: ${data.text},
            sender: ${data.sender},
            timestamp: Time.now()
          })
        `);
        return {
          statusCode: 200,
          body: JSON.stringify(result)
        };

      case 'list':
        const messages = await client.query(fql`
          chat_messages.all()
        `);
        return {
          statusCode: 200,
          body: JSON.stringify(messages)
        };

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
  } catch (error) {
    console.error('Chat function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}