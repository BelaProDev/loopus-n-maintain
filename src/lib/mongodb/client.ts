import { MongoClient, ServerApiVersion } from 'mongodb';

let client: MongoClient | null = null;

export async function getMongoClient() {
  try {
    if (client) {
      // Test the existing connection
      await client.db().command({ ping: 1 });
      return client.db('koalax');
    }

    if (!import.meta.env.VITE_MONGODB_URI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    client = new MongoClient(import.meta.env.VITE_MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 10,
      minPoolSize: 5,
    });

    await client.connect();
    return client.db('koalax');
  } catch (error) {
    // If there's an error with the existing connection, create a new one
    if (client) {
      await client.close();
      client = null;
    }
    throw error;
  }
}

export const handleMongoError = (error: any, fallbackData: any) => {
  console.error('MongoDB Error:', error);
  return fallbackData;
};

export const closeMongoConnection = async () => {
  if (client) {
    await client.close();
    client = null;
  }
};