import { Handler } from '@netlify/functions';
import { Client, Collection, Create, Documents, Get, Index, Lambda, Match, Paginate, Var } from 'faunadb';

const client = new Client({
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
          Create(Collection('Messages'), {
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
          Paginate(
            Match(Index('messages_by_room'), roomId)
          )
        );
        console.log('Messages retrieved:', messages);

        // Transform the Fauna response to a simpler format with proper timestamp
        const messageArray = (messages.data?.data || []).map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender,
          timestamp: msg.ts?.isoString || msg.createdAt?.isoString || new Date().toISOString()
        }));

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