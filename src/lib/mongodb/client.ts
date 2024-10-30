import { MongoDatabase, DbCollection, BaseDocument } from './types';

async function performDbOperation(operation: string, collection: string, data: any) {
  try {
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
      throw new Error(`Database operation failed: ${response.statusText}`);
    }

    const result = await response.json();
    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    console.error('Database operation error:', error);
    throw error;
  }
}

export async function getMongoClient(): Promise<MongoDatabase> {
  return {
    collection<T extends BaseDocument>(name: string): DbCollection<T> {
      return {
        find: async (query = {}) => {
          const result = await performDbOperation('find', name, { query });
          return result || [];
        },
        findOne: async (query) => {
          const result = await performDbOperation('findOne', name, { query });
          return result || null;
        },
        insertOne: async (doc) => {
          const result = await performDbOperation('insertOne', name, doc);
          return { insertedId: result.insertedId };
        },
        updateOne: async (query, update, options) => {
          const result = await performDbOperation('updateOne', name, { 
            query, 
            update: update.$set, 
            upsert: options?.upsert 
          });
          return { 
            matchedCount: result.matchedCount || 0,
            upsertedId: result.upsertedId
          };
        },
        deleteOne: async (query) => {
          const result = await performDbOperation('deleteOne', name, { query });
          return { deletedCount: result.deletedCount || 0 };
        },
      };
    },
  };
}

export const handleMongoError = (error: any, fallbackData: any) => {
  console.error('MongoDB Error:', error);
  return fallbackData;
};