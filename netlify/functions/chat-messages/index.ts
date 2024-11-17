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
    const { action, data, roomId } = JSON.parse(event.body || '{}');
    const client = getFaunaClient();

    // Ensure collections exist
    await client.query(fql`
      if (!Collection.byName("chat_messages")) {
        Collection.create({
          name: "chat_messages",
          indexes: {
            by_room: {
              terms: [{ field: "roomId" }]
            }
          }
        })
      }
    `);

    switch (action) {
      case 'list':
        if (!roomId) {
          return {
            statusCode: 400,
            body: JSON.stringify({ success: false, error: 'Room ID is required' })
          };
        }

        const messages = await client.query(fql`
          let messages = chat_messages.index("by_room").match(${roomId})
          messages.order(-.timestamp).limit(100)
        `);
        
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, data: messages.data })
        };

      case 'create':
        if (!data?.roomId || !data?.content) {
          return {
            statusCode: 400,
            body: JSON.stringify({ success: false, error: 'Room ID and content are required' })
          };
        }

        const newMessage = await client.query(fql`
          chat_messages.create({
            roomId: ${data.roomId},
            sender: ${data.sender},
            content: ${data.content},
            type: ${data.type || 'text'},
            timestamp: Time.now(),
            metadata: {
              version: 1,
              isEdited: false,
              reactions: []
            }
          })
        `);
        
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, data: newMessage.data })
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