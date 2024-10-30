import { getMongoClient, handleMongoError } from '../client';
import { InvoiceDocument } from '../types';
import { ObjectId } from 'mongodb';

export const invoiceQueries = {
  createInvoice: async (data: Omit<InvoiceDocument, '_id'>) => {
    try {
      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');

      const timestamp = Date.now();
      const invoiceData = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
        status: data.status || 'draft'
      };
      
      const result = await db.collection('invoices').insertOne(invoiceData);
      return { id: result.insertedId.toString(), ...invoiceData };
    } catch (error) {
      return handleMongoError(error, { data });
    }
  },

  getInvoices: async () => {
    try {
      const db = await getMongoClient();
      if (!db) throw new Error('Database connection failed');

      const queryResult = await db.collection('invoices').find();
      const invoices = await queryResult.toArray();
      return invoices
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        .map(invoice => ({
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

      const result = await db.collection('invoices').updateOne(
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