import { getFaunaClient } from '../client';
import { fql } from 'fauna';
import type { Invoice, InvoiceItem } from '@/types/invoice';
import { extractFaunaData } from '../utils';

const formatInvoiceDocument = (document: any): Invoice | null => {
  if (!document) return null;
  return {
    id: document.ref.id,
    ...document.data,
    items: (document.data.items || []).map((item: InvoiceItem) => ({
      ...item,
      [Symbol.iterator]: undefined
    }))
  };
};

export const invoiceQueries = {
  getInvoices: async (): Promise<Invoice[]> => {
    const client = getFaunaClient();
    if (!client) return [];
    try {
      const query = fql`invoices.all()`;
      const result = await client.query(query);
      const documents = extractFaunaData<Invoice>(result);
      return documents.map(doc => formatInvoiceDocument(doc)!).filter(Boolean);
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
        let now = Time.now()
        let thirtyDays = { days: 30 }
        invoices.create({
          number: ${data.number || `INV-${Date.now()}`},
          date: now,
          dueDate: Time.add(now, thirtyDays),
          clientId: ${data.clientId},
          providerId: ${data.providerId},
          items: ${data.items.map(item => ({ ...item, [Symbol.iterator]: undefined }))},
          status: ${data.status || 'draft'},
          totalAmount: ${data.totalAmount || 0},
          tax: ${data.tax || 0},
          notes: ${data.notes || ''}
        })
      `;
      const result = await client.query(query);
      const document = extractFaunaData<Invoice>(result)[0];
      return formatInvoiceDocument(document);
    } catch (error) {
      console.error('Error creating invoice:', error);
      return null;
    }
  },

  updateInvoice: async (id: string, data: Omit<Invoice, 'id'>): Promise<Invoice | null> => {
    const client = getFaunaClient();
    if (!client) return null;
    try {
      const query = fql`
        invoices.byId(${id}).update({
          number: ${data.number},
          date: ${data.date},
          dueDate: ${data.dueDate},
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
      return formatInvoiceDocument(document);
    } catch (error) {
      console.error('Error updating invoice:', error);
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