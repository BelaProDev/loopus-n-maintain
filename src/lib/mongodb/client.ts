import { MongoClient, ServerApiVersion } from 'mongodb';

if (!import.meta.env.VITE_MONGODB_URI) {
  throw new Error('MongoDB URI is not defined in environment variables');
}

const client = new MongoClient(import.meta.env.VITE_MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export const getMongoClient = async () => {
  try {
    await client.connect();
    return client.db('koalax');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export const handleMongoError = (error: any, fallbackData: any) => {
  console.error('MongoDB Error:', error);
  return fallbackData;
};