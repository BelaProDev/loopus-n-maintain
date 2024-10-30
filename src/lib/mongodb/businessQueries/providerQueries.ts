import { getMongoClient, handleMongoError } from '../client';
import { BusinessDocument } from '../types';
import { ObjectId } from 'mongodb';

export const providerQueries = {
  createProvider: async (data: Omit<BusinessDocument, '_id'>) => {
    try {
      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');
      
      const providerData = {
        ...data,
        type: 'provider' as const
      };
      
      const result = await db.collection('providers').insertOne(providerData);
      return { id: result.insertedId.toString(), ...providerData };
    } catch (error) {
      return handleMongoError(error, { data });
    }
  },

  getProviders: async () => {
    try {
      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');
      
      const providers = await db.collection('providers')
        .find({ type: 'provider' })
        .toArray();
      return providers.map(provider => ({
        id: provider._id?.toString(),
        ...provider
      }));
    } catch (error) {
      return handleMongoError(error, []);
    }
  },

  updateProvider: async (id: string, data: Partial<BusinessDocument>) => {
    try {
      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');

      const updateData = {
        ...data,
        type: 'provider' as const,
        updatedAt: Date.now()
      };

      await db.collection('providers').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      return { id, ...updateData };
    } catch (error) {
      return handleMongoError(error, null);
    }
  },

  deleteProvider: async (id: string) => {
    try {
      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');

      await db.collection('providers').deleteOne({ _id: new ObjectId(id) });
      return { success: true };
    } catch (error) {
      return handleMongoError(error, { success: false });
    }
  }
};