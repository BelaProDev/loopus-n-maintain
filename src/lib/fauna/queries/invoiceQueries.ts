import { getFaunaClient } from '../client';
import { fql } from 'fauna';
import type { Invoice, InvoiceItem } from '@/types/invoice';
import { extractFaunaData } from '../utils';

export const invoiceQueries = {
  getInvoices: async (): Promise<Invoice[]> => {
    const client = getFaunaClient();
    if (!client) return [];
    try {
      const query = fql`invoices.all()`;
      const result = await client.query(query);
      const documents = extractFaunaData<Invoice>(result);
      return documents.map(doc => ({
        id: doc.ref.id,
        ...doc.data,
        date: new Date(doc.data.date).toISOString(),
        dueDate: new Date(doc.data.dueDate).toISOString(),
        items: (doc.data.items || []).map((item: InvoiceItem) => ({
          ...item,
          [Symbol.iterator]: undefined
        }))
      }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }
  },

  createInvoice: async (data: Omit<Invoice, 'id'>): Promise<Invoice | null> => {
    const client = getFaunaClient();
    if (!client) return null;
    try {
      const query = fql`
        invoices.create({
          number: ${data.number},
          date: Time(${data.date}),
          dueDate: Time(${data.dueDate}),
          clientId: ${data.clientId},
          providerId: ${data.providerId},
          items: ${data.items.map(item => ({ ...item, [Symbol.iterator]: undefined }))},
          status: ${data.status},
          totalAmount: ${data.totalAmount},
          tax: ${data.tax},
          notes: ${data.notes}
        })
      `;
      const result = await client.query(query);
      const document = extractFaunaData<Invoice>(result)[0];
      return document ? {
        id: document.ref.id,
        ...document.data,
        date: new Date(document.data.date).toISOString(),
        dueDate: new Date(document.data.dueDate).toISOString(),
        items: (document.data.items || []).map((item: InvoiceItem) => ({
          ...item,
          [Symbol.iterator]: undefined
        }))
      } : null;
    } catch (error) {
      console.error('Error creating invoice:', error);
      return null;
    }
  },

  deleteInvoice: async (id: string): Promise<boolean> => {
    const client = getFaunaClient();
    if (!client) return false;
    try {
      const query = fql`invoices.byId(${id}).delete()`;
      await client.query(query);
      return true;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      return false;
    }
  }
};