import { MongoClient, ServerApiVersion } from 'mongodb';

let client: MongoClient | null = null;

export async function getMongoClient() {
  if (client) return client.db('koalax');

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
}

export const handleMongoError = (error: any, fallbackData: any) => {
  console.error('MongoDB Error:', error);
  return fallbackData;
};

// Cleanup function for SSR
export const closeMongoConnection = async () => {
  if (client) {
    await client.close();
    client = null;
  }
};