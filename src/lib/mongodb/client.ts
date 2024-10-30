import { MongoDatabase, DbCollection, BaseDocument, DbQueryResult } from './types';
import { withAsyncHandler, retryWithBackoff } from '../asyncUtils';
import { fallbackDB } from '../fallback-db';

async function performDbOperation(operation: string, collection: string, data: any) {
  try {
    const response = await retryWithBackoff(async () => {
      const { data: result, error } = await withAsyncHandler(
        async () => {
          const response = await fetch('/.netlify/functions/db-operations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operation, collection, data }),
          });

          if (!response.ok) throw new Error(`Database operation failed: ${response.statusText}`);
          const result = await response.json();
          if (result.error) throw new Error(result.error);
          return result;
        }
      );
      if (error) throw error;
      return result;
    });
    return response;
  } catch (error) {
    console.warn('Falling back to local storage:', error);
    
    switch (operation) {
      case 'find':
        return fallbackDB.find(collection as any, data.query);
      case 'findOne':
        return fallbackDB.findOne(collection as any, data.query);
      case 'insertOne':
        return fallbackDB.insert(collection as any, data);
      case 'updateOne':
        return fallbackDB.update(collection as any, data.query, data.update);
      case 'deleteOne':
        return fallbackDB.delete(collection as any, data.query);
      default:
        return null;
    }
  }
}

export async function getMongoClient(): Promise<MongoDatabase> {
  return {
    collection<T extends BaseDocument>(name: string): DbCollection<T> {
      return {
        async find(query = {}) {
          const result = await performDbOperation('find', name, { query });
          const data = result || [];
          
          const queryResult: DbQueryResult<T> = {
            data,
            sort: (field: keyof T) => {
              const sortedData = [...data].sort((a, b) => 
                (a[field] > b[field] ? 1 : -1)
              );
              return {
                data: sortedData,
                sort: queryResult.sort,
                toArray: () => Promise.resolve(sortedData),
                map: <U>(callback: (value: T, index: number, array: T[]) => U) => 
                  sortedData.map(callback)
              };
            },
            toArray: () => Promise.resolve(data),
            map: <U>(callback: (value: T, index: number, array: T[]) => U) => 
              data.map(callback)
          };
          
          return Promise.resolve(queryResult);
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
  console.warn('MongoDB Error, using fallback data:', error);
  return fallbackData;
};