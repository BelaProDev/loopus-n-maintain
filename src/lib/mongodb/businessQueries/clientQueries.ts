import { getMongoClient, handleMongoError } from '../client';
import { BusinessDocument } from '../types';
import { ObjectId } from 'mongodb';

export const clientQueries = {
  createClient: async (data: Omit<BusinessDocument, '_id'>) => {
    try {
      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');
      
      const timestamp = Date.now();
      const clientData = {
        ...data,
        type: 'client' as const,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      const result = await db.collection('clients').insertOne(clientData);
      return { id: result.insertedId.toString(), ...clientData };
    } catch (error) {
      return handleMongoError(error, { data });
    }
  },

  getClients: async () => {
    try {
      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');
      
      const clients = await db.collection('clients')
        .find({ type: 'client' })
        .sort({ name: 1 })
        .toArray();
      return clients.map(client => ({
        id: client._id?.toString(),
        ...client
      }));
    } catch (error) {
      return handleMongoError(error, []);
    }
  },

  updateClient: async (id: string, data: Partial<BusinessDocument>) => {
    try {
      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');

      const updateData = {
        ...data,
        type: 'client' as const,
        updatedAt: Date.now()
      };

      const result = await db.collection('clients').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        throw new Error('Client not found');
      }

      return { id, ...updateData };
    } catch (error) {
      return handleMongoError(error, null);
    }
  },

  deleteClient: async (id: string) => {
    try {
      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');

      const result = await db.collection('clients').deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 0) {
        throw new Error('Client not found');
      }

      return { success: true };
    } catch (error) {
      return handleMongoError(error, { success: false });
    }
  }
};