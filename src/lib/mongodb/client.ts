import { MongoClient, ServerApiVersion } from 'mongodb';

let client: MongoClient | null = null;

export async function getMongoClient() {
  // Only attempt MongoDB connection if we're in the admin interface
  if (!window.location.pathname.startsWith('/koalax')) {
    return null;
  }

  try {
    if (client) {
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
      }
    });

    await client.connect();
    return client.db('koalax');
  } catch (error) {
    if (client) {
      await client.close();
      client = null;
    }
    console.error('MongoDB connection error:', error);
    return null;
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