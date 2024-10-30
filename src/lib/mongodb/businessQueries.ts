import { getMongoClient, handleMongoError } from './client';
import { BusinessDocument, InvoiceDocument } from './types';
import { ObjectId } from 'mongodb';

const validateBusinessDocument = (data: Partial<BusinessDocument>): boolean => {
  if (!data.name || !data.email || !data.type) return false;
  if (data.type !== 'client' && data.type !== 'provider') return false;
  return true;
};

const validateInvoiceDocument = (data: Partial<InvoiceDocument>): boolean => {
  if (!data.clientId || !data.providerId || !data.items) return false;
  if (!Array.isArray(data.items) || data.items.length === 0) return false;
  return true;
};

export const businessQueries = {
  // Client queries
  createClient: async (data: Omit<BusinessDocument, '_id'>) => {
    try {
      if (!validateBusinessDocument(data)) {
        throw new Error('Invalid client data');
      }

      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');
      
      const timestamp = Date.now();
      const clientData = {
        ...data,
        type: 'client',
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      const result = await db.collection<BusinessDocument>('clients').insertOne(clientData);
      return { id: result.insertedId.toString(), ...clientData };
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
        updatedAt: Date.now()
      };

      const result = await db.collection<BusinessDocument>('clients').updateOne(
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
      if (!validateInvoiceDocument(data)) {
        throw new Error('Invalid invoice data');
      }

      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');

      const timestamp = Date.now();
      const invoiceData = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
        status: data.status || 'draft'
      };
      
      const result = await db.collection<InvoiceDocument>('invoices').insertOne(invoiceData);
      return { id: result.insertedId.toString(), ...invoiceData };
    } catch (error) {
      return handleMongoError(error, { data });
    }
  },

  getInvoices: async () => {
    try {
      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');

      const invoices = await db.collection<InvoiceDocument>('invoices')
        .find()
        .sort({ createdAt: -1 })
        .toArray();
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
      if (!db) throw new Error('Database connection failed');

      const result = await db.collection<InvoiceDocument>('invoices').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            status,
            updatedAt: Date.now()
          } 
        }
      );

      if (result.matchedCount === 0) {
        throw new Error('Invoice not found');
      }

      return { id, status };
    } catch (error) {
      return handleMongoError(error, { id, status });
    }
  },

  deleteInvoice: async (id: string) => {
    try {
      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');

      const result = await db.collection('invoices').deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 0) {
        throw new Error('Invoice not found');
      }

      return { success: true };
    } catch (error) {
      return handleMongoError(error, { success: false });
    }
  }
};