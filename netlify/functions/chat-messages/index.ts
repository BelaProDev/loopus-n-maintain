import { Handler } from '@netlify/functions';
import { Client, fql } from 'fauna';

const getFaunaClient = () => {
  const secret = process.env.FAUNA_SECRET_KEY;
  if (!secret) throw new Error('FAUNA_SECRET_KEY not set');
  return new Client({ secret });
};

const setupCollections = async (client: Client) => {
  // Create chat_rooms collection if it doesn't exist
  await client.query(fql`
    if (!Collection.byName("chat_rooms")) {
      Collection.create({
        name: "chat_rooms",
        indexes: {
          by_name: { terms: [{ field: ["data", "name"] }] }
        }
      })
    }
  `);

  // Create chat_messages collection if it doesn't exist
  await client.query(fql`
    if (!Collection.byName("chat_messages")) {
      Collection.create({
        name: "chat_messages",
        indexes: {
          by_room: { terms: [{ field: ["data", "roomId"] }] }
        }
      })
    }
  `);
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { action, data, roomId } = JSON.parse(event.body || '{}');
    const client = getFaunaClient();
    await setupCollections(client);

    switch (action) {
      case 'list': {
        if (!roomId) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Room ID required' }) };
        }

        const messages = await client.query(fql`
          let messages = chat_messages.index("by_room").match(${roomId})
          messages.order(-.timestamp).limit(50)
        `);

        return {
          statusCode: 200,
          body: JSON.stringify({
            data: messages.data.map(msg => ({
              id: msg.id,
              ...msg.data
            }))
          })
        };
      }

      case 'create': {
        if (!data?.roomId || !data?.content?.trim()) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Room ID and content required' }) };
        }

        const newMessage = await client.query(fql`
          chat_messages.create({
            roomId: ${data.roomId},
            sender: ${data.sender || 'Anonymous'},
            content: ${data.content.trim()},
            timestamp: Time.now()
          })
        `);

        return {
          statusCode: 200,
          body: JSON.stringify({
            data: {
              id: newMessage.data.id,
              ...newMessage.data
            }
          })
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