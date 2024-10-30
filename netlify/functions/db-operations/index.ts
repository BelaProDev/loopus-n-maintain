import { Handler } from '@netlify/functions';
import { MongoClient, ObjectId } from 'mongodb';

let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { operation, collection, data } = JSON.parse(event.body || '{}');
    const client = await connectToDatabase();
    const db = client.db(process.env.MONGODB_DB_NAME || 'koalax');

    let result;
    switch (operation) {
      case 'listCollections':
        result = await db.listCollections().toArray();
        break;

      case 'createCollection':
        result = await db.createCollection(collection);
        break;

      case 'createIndex':
        result = await db.collection(collection).createIndex(data.keys, data.options);
        break;

      case 'find':
        const query = data.query || {};
        if (query._id) {
          query._id = new ObjectId(query._id);
        }
        result = await db.collection(collection).find(query).toArray();
        result = result.map(doc => ({
          ...doc,
          _id: doc._id.toString(),
        }));
        break;

      case 'findOne':
        const findQuery = data.query || {};
        if (findQuery._id) {
          findQuery._id = new ObjectId(findQuery._id);
        }
        result = await db.collection(collection).findOne(findQuery);
        if (result) {
          result._id = result._id.toString();
        }
        break;

      case 'insertOne':
        result = await db.collection(collection).insertOne(data);
        result = { 
          ...result, 
          insertedId: result.insertedId.toString() 
        };
        break;

      case 'updateOne':
        const updateQuery = data.query;
        if (updateQuery._id) {
          updateQuery._id = new ObjectId(updateQuery._id);
        }
        result = await db.collection(collection).updateOne(
          updateQuery,
          { $set: data.update },
          { upsert: data.upsert }
        );
        break;

      case 'deleteOne':
        const deleteQuery = data.query;
        if (deleteQuery._id) {
          deleteQuery._id = new ObjectId(deleteQuery._id);
        }
        result = await db.collection(collection).deleteOne(deleteQuery);
        break;

      default:
        throw new Error('Invalid operation');
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Database operation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};

export { handler };