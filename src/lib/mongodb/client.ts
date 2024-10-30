import { Db } from 'mongodb';

async function performDbOperation(operation: string, collection: string, data: any) {
  const response = await fetch('/.netlify/functions/db-operations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      operation,
      collection,
      data,
    }),
  });

  if (!response.ok) {
    throw new Error('Database operation failed');
  }

  return response.json();
}

export async function getMongoClient(): Promise<Db | null> {
  // This is now just a wrapper for the Netlify function calls
  if (!window.location.pathname.startsWith('/koalax-admin')) {
    return null;
  }

  // Return a proxy object that mimics the Db interface
  return {
    collection: (name: string) => ({
      find: (query = {}) => ({
        toArray: async () => performDbOperation('find', name, { query }),
        sort: () => ({ toArray: async () => performDbOperation('find', name, { query }) }),
      }),
      findOne: async (query = {}) => performDbOperation('findOne', name, { query }),
      insertOne: async (doc: any) => performDbOperation('insertOne', name, doc),
      updateOne: async (query: any, update: any, options: any) => 
        performDbOperation('updateOne', name, { query, update: update.$set, upsert: options?.upsert }),
      deleteOne: async (query: any) => performDbOperation('deleteOne', name, { query }),
    }),
  } as unknown as Db;
}

export const handleMongoError = (error: any, fallbackData: any) => {
  if (window.location.pathname.startsWith('/koalax-admin')) {
    console.error('MongoDB Error:', error);
  }
  return fallbackData;
};

export const closeMongoConnection = async () => {
  // No need to close connection as it's handled by Netlify functions
};