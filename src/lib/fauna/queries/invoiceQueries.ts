import { getFaunaClient } from '../client';
import { fql } from 'fauna';
import type { Invoice, InvoiceItem } from '@/types/invoice';
import { extractFaunaData } from '../utils';

const parseDate = (date: any): string => {
  if (!date) return new Date().toISOString();
  try {
    return new Date(date).toISOString();
  } catch (e) {
    return new Date().toISOString();
  }
};

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
        date: parseDate(doc.data.date),
        dueDate: parseDate(doc.data.dueDate),
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
      const currentDate = new Date().toISOString();
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const query = fql`
        invoices.create({
          number: ${data.number || `INV-${Date.now()}`},
          date: Time(${parseDate(data.date || currentDate)}),
          dueDate: Time(${parseDate(data.dueDate || thirtyDaysFromNow)}),
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
      return document ? {
        id: document.ref.id,
        ...document.data,
        date: parseDate(document.data.date),
        dueDate: parseDate(document.data.dueDate),
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