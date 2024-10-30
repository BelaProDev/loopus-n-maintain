import { MongoDatabase, DbCollection, BaseDocument, DbQueryResult } from './types';
import { fallbackDB } from '../fallback-db';

export async function getMongoClient(): Promise<MongoDatabase> {
  return {
    collection<T extends BaseDocument>(name: string): DbCollection<T> {
      return {
        async find(query = {}) {
          const data = fallbackDB.find(name as any, query);
          
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
          return fallbackDB.findOne(name as any, query);
        },
        insertOne: async (doc) => {
          const result = fallbackDB.insert(name as any, doc);
          return { insertedId: result.insertedId };
        },
        updateOne: async (query, update) => {
          const result = fallbackDB.update(name as any, query, update.$set);
          return { 
            matchedCount: result.modifiedCount,
            upsertedId: null
          };
        },
        deleteOne: async (query) => {
          const result = fallbackDB.delete(name as any, query);
          return { deletedCount: result.deletedCount };
        },
      };
    },
  };
}

export const handleMongoError = (error: any, fallbackData: any) => {
  console.warn('Using fallback data:', error);
  return fallbackData;
};