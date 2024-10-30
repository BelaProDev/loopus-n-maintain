import { MongoClient, ServerApiVersion } from 'mongodb';

let client: MongoClient | null = null;

export async function getMongoClient() {
  // Only attempt MongoDB connection if we're in the admin interface
  if (!window.location.pathname.startsWith('/koalax')) {
    return handleMongoError(new Error('Not in admin interface'), null);
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
    return handleMongoError(error, null);
  }
}

export const handleMongoError = (error: any, fallbackData: any) => {
  // Only log errors if we're in the admin interface
  if (window.location.pathname.startsWith('/koalax')) {
    console.error('MongoDB Error:', error);
  }
  
  if (client) {
    client.close().catch(console.error);
    client = null;
  }
  
  return fallbackData;
};

export const closeMongoConnection = async () => {
  if (client) {
    await client.close();
    client = null;
  }
};