import { MongoDatabase, DbCollection, BaseDocument, DbQueryResult } from './types';
import { withAsyncHandler, retryWithBackoff } from '../asyncUtils';

const STORAGE_PREFIX = 'koalax_';

// Local storage fallback implementation
const localStorageDB = {
  getItem: (collection: string) => {
    try {
      const data = localStorage.getItem(`${STORAGE_PREFIX}${collection}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  setItem: (collection: string, data: any[]) => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${collection}`, JSON.stringify(data));
    } catch (error) {
      console.error('Local storage error:', error);
    }
  }
};

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
    // Fallback to local storage
    console.warn('Falling back to local storage:', error);
    
    switch (operation) {
      case 'find':
        return localStorageDB.getItem(collection);
      case 'findOne':
        const items = localStorageDB.getItem(collection);
        return items.find((item: any) => 
          Object.entries(data.query || {}).every(([key, value]) => item[key] === value)
        );
      case 'insertOne':
        const existingData = localStorageDB.getItem(collection);
        const newItem = { ...data, _id: crypto.randomUUID() };
        localStorageDB.setItem(collection, [...existingData, newItem]);
        return { insertedId: newItem._id };
      case 'updateOne':
        const currentData = localStorageDB.getItem(collection);
        const updatedData = currentData.map((item: any) => {
          if (Object.entries(data.query).every(([key, value]) => item[key] === value)) {
            return { ...item, ...data.update };
          }
          return item;
        });
        localStorageDB.setItem(collection, updatedData);
        return { matchedCount: 1 };
      case 'deleteOne':
        const items = localStorageDB.getItem(collection);
        const filteredItems = items.filter((item: any) => 
          !Object.entries(data.query).every(([key, value]) => item[key] === value)
        );
        localStorageDB.setItem(collection, filteredItems);
        return { deletedCount: items.length - filteredItems.length };
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