import { MongoClient, ServerApiVersion, Db } from 'mongodb';
import { EmailDocument, ContentDocument, BusinessDocument, InvoiceDocument } from './types';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getMongoClient(): Promise<Db | null> {
  // Only attempt MongoDB connection if we're in the admin interface
  if (!window.location.pathname.startsWith('/koalax-admin')) {
    return handleMongoError(new Error('Not in admin interface'), null);
  }

  try {
    if (client && db) {
      await client.db().command({ ping: 1 });
      return db;
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
    db = client.db('koalax');
    return db;
  } catch (error) {
    return handleMongoError(error, null);
  }
}

export const handleMongoError = (error: any, fallbackData: any) => {
  // Only log errors if we're in the admin interface
  if (window.location.pathname.startsWith('/koalax-admin')) {
    console.error('MongoDB Error:', error);
  }
  
  if (client) {
    client.close().catch(console.error);
    client = null;
    db = null;
  }
  
  return fallbackData;
};

export const closeMongoConnection = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
};