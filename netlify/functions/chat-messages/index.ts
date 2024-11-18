import { Handler } from '@netlify/functions';
import faunadb from 'faunadb';
const q = faunadb.query;

const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET_KEY || '',
  domain: 'db.fauna.com',
});

export const handler: Handler = async (event) => {
  try {
    const { action, data, roomId } = JSON.parse(event.body || '{}');
    console.log('Chat Messages Function - Request:', { action, data, roomId });

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

        const message = await client.query(
          q.Create(q.Collection('Messages'), {
            data: {
              roomId,
              content: data.content,
              sender: data.sender,
              timestamp: new Date().toISOString()
            }
          })
        );

        return {
          statusCode: 200,
          body: JSON.stringify({ data: message })
        };
      }

      case 'list': {
        console.log('Listing messages for room:', roomId);
        const messages = await client.query(
          q.Paginate(
            q.Match(q.Index('messages_by_room'), roomId)
          )
        );
        console.log('Messages retrieved:', messages);

        // Transform the Fauna response to a consistent format
        const messageArray = messages.data.map((msg: any) => {
          const timestamp = msg.ts?.isoString || msg.createdAt?.isoString || new Date().toISOString();
          return {
            id: msg.id || msg.ref?.id,
            content: msg.data?.content || msg.content,
            sender: msg.data?.sender || msg.sender,
            timestamp
          };
        });

        return {
          statusCode: 200,
          body: JSON.stringify({ data: messageArray })
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
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
};