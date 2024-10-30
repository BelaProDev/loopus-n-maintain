import { Handler } from '@netlify/functions';
import { getDatabase } from '../lib/mongodb';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { operation, collection, data } = JSON.parse(event.body || '{}');
    const db = await getDatabase();

    let result;
    switch (operation) {
      case 'find':
        result = await db.collection(collection).find(data.query || {}).toArray();
        break;
      case 'findOne':
        result = await db.collection(collection).findOne(data.query || {});
        break;
      case 'insertOne':
        result = await db.collection(collection).insertOne(data);
        break;
      case 'updateOne':
        result = await db.collection(collection).updateOne(
          data.query,
          { $set: data.update },
          { upsert: data.upsert }
        );
        break;
      case 'deleteOne':
        result = await db.collection(collection).deleteOne(data.query);
        break;
      default:
        throw new Error('Invalid operation');
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Database operation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export { handler };