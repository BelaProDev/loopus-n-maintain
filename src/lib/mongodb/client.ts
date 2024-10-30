import { MongoClient, ServerApiVersion, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;
let isConnecting = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;

export async function getMongoClient(): Promise<Db | null> {
  if (!window.location.pathname.startsWith('/koalax-admin')) {
    return handleMongoError(new Error('Not in admin interface'), null);
  }

  try {
    // If we're already connecting, wait for the connection
    if (isConnecting) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return db;
    }

    // Check existing connection
    if (client && db) {
      try {
        await client.db().command({ ping: 1 });
        return db;
      } catch (error) {
        console.warn('Connection lost, attempting reconnection...');
        await closeMongoConnection();
      }
    }

    if (!import.meta.env.VITE_MONGODB_URI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    isConnecting = true;
    reconnectAttempts++;

    client = new MongoClient(import.meta.env.VITE_MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      connectTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      waitQueueTimeoutMS: 10000,
    });

    await client.connect();
    db = client.db('koalax');
    isConnecting = false;
    reconnectAttempts = 0;
    return db;
  } catch (error) {
    isConnecting = false;
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      await new Promise(resolve => setTimeout(resolve, 1000 * reconnectAttempts));
      return getMongoClient();
    }
    return handleMongoError(error, null);
  }
}

export const handleMongoError = (error: any, fallbackData: any) => {
  if (window.location.pathname.startsWith('/koalax-admin')) {
    console.error('MongoDB Error:', error);
  }
  
  closeMongoConnection().catch(console.error);
  return fallbackData;
};

export const closeMongoConnection = async () => {
  if (client) {
    try {
      await client.close(true);
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    }
    client = null;
    db = null;
  }
};