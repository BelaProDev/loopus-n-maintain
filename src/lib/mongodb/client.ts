type MongoOperation = {
  find: (query?: any) => { 
    toArray: () => Promise<any[]>;
    sort: (sort?: any) => { toArray: () => Promise<any[]> };
  };
  findOne: (query?: any) => Promise<any>;
  insertOne: (doc: any) => Promise<any>;
  updateOne: (query: any, update: any, options?: any) => Promise<any>;
  deleteOne: (query: any) => Promise<any>;
  createIndex?: (keys: any, options?: any) => Promise<any>;
};

type MongoClient = {
  collection: (name: string) => MongoOperation;
  listCollections?: () => { toArray: () => Promise<any[]> };
  createCollection?: (name: string) => Promise<any>;
};

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
    return null;
  }
}

export async function getMongoClient(): Promise<MongoClient> {
  return {
    collection: (name: string): MongoOperation => ({
      find: (query = {}) => ({
        toArray: async () => performDbOperation('find', name, { query }),
        sort: () => ({ toArray: async () => performDbOperation('find', name, { query }) }),
      }),
      findOne: async (query = {}) => performDbOperation('findOne', name, { query }),
      insertOne: async (doc: any) => performDbOperation('insertOne', name, doc),
      updateOne: async (query: any, update: any, options?: any) => 
        performDbOperation('updateOne', name, { query, update: update.$set, upsert: options?.upsert }),
      deleteOne: async (query: any) => performDbOperation('deleteOne', name, { query }),
      createIndex: async (keys: any, options?: any) => 
        performDbOperation('createIndex', name, { keys, options }),
    }),
    listCollections: () => ({
      toArray: async () => performDbOperation('listCollections', '', {})
    }),
    createCollection: async (name: string) => 
      performDbOperation('createCollection', name, {}),
  };
}

export const handleMongoError = (error: any, fallbackData: any) => {
  console.error('MongoDB Error:', error);
  return fallbackData;
};