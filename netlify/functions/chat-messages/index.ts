```typescript
import { Client, fql } from 'fauna';

const getFaunaClient = () => {
  const secret = process.env.FAUNA_SECRET_KEY;
  if (!secret) throw new Error('FAUNA_SECRET_KEY not set');
  return new Client({ secret });
};

export const handler = async (event) => {
  try {
    const client = getFaunaClient();
    const { action, data, roomId } = JSON.parse(event.body);

    switch (action) {
      case 'create': {
        const message = await client.query(fql`
          let message = Messages.create({
            content: ${data.content},
            sender: ${data.sender},
            room: Room.byId(${roomId}),
            createdAt: Time.now()
          })
          message
        `);

        return {
          statusCode: 200,
          body: JSON.stringify({ data: message })
        };
      }

      case 'list': {
        const messages = await client.query(fql`
          let room = Room.byId(${roomId})
          let messages = Messages.where(.room == room).order(-.createdAt)
          messages
        `);

        return {
          statusCode: 200,
          body: JSON.stringify({ data: messages })
        };
      }

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```