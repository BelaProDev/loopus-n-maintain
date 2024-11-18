import { Handler } from '@netlify/functions';
import * as faunadb from 'faunadb';

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET_KEY || '',
  domain: 'db.fauna.com',
});

export const handler: Handler = async (event) => {
  try {
    const { roomId, action, data } = JSON.parse(event.body || '{}');

    if (!roomId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Room ID is required' })
      };
    }

    switch (action) {
      case 'create': {
        if (!data?.content) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Message content is required' })
          };
        }

        const message = await client.query(
          q.Create(q.Collection('Messages'), {
            data: {
              roomId,
              content: data.content,
              createdAt: new Date().toISOString()
            }
          })
        );

        return {
          statusCode: 200,
          body: JSON.stringify({ message })
        };
      }

      case 'list': {
        console.log('Listing messages for room:', roomId);
        const messages = await client.query(
          q.Map(
            q.Paginate(
              q.Match(q.Index('messages_by_room'), roomId)
            ),
            q.Lambda('ref', q.Get(q.Var('ref')))
          )
        );
        console.log('Messages retrieved:', messages);

        return {
          statusCode: 200,
          body: JSON.stringify({ messages })
        };
      }

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
  } catch (error) {
    console.error('Error processing chat message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};