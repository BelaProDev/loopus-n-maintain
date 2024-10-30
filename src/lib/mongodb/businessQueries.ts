import { getMongoClient, handleMongoError } from './client';
import { BusinessDocument, InvoiceDocument } from './types';
import { ObjectId } from 'mongodb';

export const businessQueries = {
  // Client queries
  createClient: async (data: Omit<BusinessDocument, '_id'>) => {
    try {
      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');
      
      const result = await db.collection<BusinessDocument>('clients').insertOne({
        ...data,
        type: 'client'
      });
      return { id: result.insertedId.toString(), ...data };
    } catch (error) {
      return handleMongoError(error, { data });
    }
  },

  getClients: async () => {
    try {
      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');
      
      const clients = await db.collection<BusinessDocument>('clients')
        .find({ type: 'client' })
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

      await db.collection<BusinessDocument>('clients').updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...data, updatedAt: Date.now() } }
      );
      return { id, ...data };
    } catch (error) {
      return handleMongoError(error, null);
    }
  },

  deleteClient: async (id: string) => {
    try {
      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');

      await db.collection('clients').deleteOne({ _id: new ObjectId(id) });
      return { success: true };
    } catch (error) {
      return handleMongoError(error, { success: false });
    }
  },

  // Provider queries
  createProvider: async (data: Omit<BusinessDocument, '_id'>) => {
    try {
      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');
      
      const result = await db.collection<BusinessDocument>('providers').insertOne({
        ...data,
        type: 'provider'
      });
      return { id: result.insertedId.toString(), ...data };
    } catch (error) {
      return handleMongoError(error, { data });
    }
  },

  getProviders: async () => {
    try {
      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');
      
      const providers = await db.collection<BusinessDocument>('providers')
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

      await db.collection<BusinessDocument>('providers').updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...data, updatedAt: Date.now() } }
      );
      return { id, ...data };
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
  },

  // Invoice queries
  createInvoice: async (data: Omit<InvoiceDocument, '_id'>) => {
    try {
      const db = await getMongoClient();
      const result = await db.collection<InvoiceDocument>('invoices').insertOne(data);
      return { id: result.insertedId.toString(), ...data };
    } catch (error) {
      return handleMongoError(error, { data });
    }
  },

  getInvoices: async () => {
    try {
      const db = await getMongoClient();
      const invoices = await db.collection<InvoiceDocument>('invoices').find().toArray();
      return invoices.map(invoice => ({
        id: invoice._id?.toString(),
        ...invoice
      }));
    } catch (error) {
      return handleMongoError(error, []);
    }
  },

  updateInvoiceStatus: async (id: string, status: InvoiceDocument['status']) => {
    try {
      const db = await getMongoClient();
      await db.collection<InvoiceDocument>('invoices').updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
      );
      return { id, status };
    } catch (error) {
      return handleMongoError(error, { id, status });
    }
  },

  deleteInvoice: async (id: string) => {
    try {
      const db = await getMongoClient();
      await db.collection('invoices').deleteOne({ _id: new ObjectId(id) });
      return { success: true };
    } catch (error) {
      return handleMongoError(error, { success: false });
    }
  }
};