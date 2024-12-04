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
    const { action, data, roomId } = JSON.parse(event.body);

    if (!roomId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Room ID is required' })
      };
    }

    switch (action) {
      case 'create': {
        if (!data?.content || !data?.sender) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Content and sender are required' })
          };
        }

        const message = await client.query(fql`
          let newMessage = Messages.create({
            content: ${data.content},
            sender: ${data.sender},
            room: Room.byId(${roomId}),
            createdAt: Time.now()
          })
          {
            id: newMessage.id,
            content: newMessage.content,
            sender: newMessage.sender,
            createdAt: newMessage.createdAt,
            room: {
              id: newMessage.room.id
            }
          }
        `);

        return {
          statusCode: 200,
          body: JSON.stringify({ data: message })
        };
      }

      case 'list': {
        const messages = await client.query(fql`
          let messages = Messages.where(.room == Room.byId(${roomId}))
          messages {
            id: messages.id,
            content: messages.content,
            sender: messages.sender,
            createdAt: messages.createdAt,
            room: {
              id: messages.room.id
            }
          }
        `);

        return {
          statusCode: 200,
          body: JSON.stringify({ 
            data: {
              data: messages.data
            }
          })
        };
      }

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
  } catch (error) {
    console.error('Error in chat messages function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};