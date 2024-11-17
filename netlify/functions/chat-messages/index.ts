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
    const { action, data, roomId } = JSON.parse(event.body || '{}');
    const client = getFaunaClient();

    switch (action) {
      case 'list': {
        if (!roomId) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Room ID required' }) };
        }

        const result = await client.query(fql`
          let messages = chat_messages.all().where(.roomId == ${roomId})
          {
            data: messages.order(-.timestamp).take(50).map(msg => {
              {
                id: msg.id,
                roomId: msg.roomId,
                sender: msg.sender,
                content: msg.content,
                timestamp: msg.timestamp
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
        if (!data?.roomId || !data?.content?.trim()) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Room ID and content required' }) };
        }

        const result = await client.query(fql`
          let newMessage = chat_messages.create({
            roomId: ${data.roomId},
            sender: ${data.sender || 'Anonymous'},
            content: ${data.content.trim()},
            timestamp: Time.now()
          })
          {
            id: newMessage.id,
            roomId: newMessage.roomId,
            sender: newMessage.sender,
            content: newMessage.content,
            timestamp: newMessage.timestamp
          }
        `);

        return {
          statusCode: 200,
          body: JSON.stringify({ data: result })
        };
      }

      default:
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid action' }) };
    }
  } catch (error) {
    console.error('Chat messages error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};