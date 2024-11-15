import { getFaunaClient } from './client';
import { fql } from 'fauna';
import type { Client, Provider } from '@/types/business';
import type { Invoice, InvoiceItem } from '@/types/invoice';
import { extractFaunaData } from './utils';

const createBusinessQueries = (client: ReturnType<typeof getFaunaClient>) => ({
  getClients: async (): Promise<Client[]> => {
    if (!client) return [];
    try {
      const query = fql`
        let clients = clients.all()
        clients.map(client => {
          {
            ...client,
            id: client.id,
            totalInvoices: invoices.all().filter(i => i.clientId == client.id).count(),
            totalAmount: invoices.all()
              .filter(i => i.clientId == client.id)
              .map(i => i.totalAmount)
              .sum() || 0
          }
        })
      `;
      const result = await client.query(query);
      const documents = extractFaunaData<Client>(result);
      return documents.map(doc => ({ id: doc.ref.id, ...doc.data }));
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  },

  getProviders: async (): Promise<Provider[]> => {
    if (!client) return [];
    try {
      const query = fql`
        let providers = providers.all()
        providers.map(provider => {
          {
            ...provider,
            id: provider.id,
            invoiceCount: invoices.all().filter(i => i.providerId == provider.id).count()
          }
        })
      `;
      const result = await client.query(query);
      const documents = extractFaunaData<Provider>(result);
      return documents.map(doc => ({ id: doc.ref.id, ...doc.data }));
    } catch (error) {
      console.error('Error fetching providers:', error);
      return [];
    }
  },

  getInvoices: async (): Promise<Invoice[]> => {
    if (!client) return [];
    try {
      const query = fql`
        let invoices = invoices.all()
        let clients = clients.all()
        let providers = providers.all()
        
        invoices.map(invoice => {
          let client = clients.filter(c => c.id == invoice.clientId).first()
          let provider = providers.filter(p => p.id == invoice.providerId).first()
          
          {
            ...invoice,
            id: invoice.id,
            client: client ? { id: client.id, name: client.name } : null,
            provider: provider ? { id: provider.id, name: provider.name } : null,
            date: invoice.date,
            dueDate: invoice.dueDate,
            items: invoice.items || [],
            totalAmount: invoice.totalAmount || 0,
            tax: invoice.tax || 0
          }
        })
      `;
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
        })),
        totalAmount: Number(doc.data.totalAmount?.['@int'] || 0),
        tax: Number(doc.data.tax?.['@int'] || 0)
      }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }
  },

  createClient: async (data: Omit<Client, 'id' | 'totalInvoices' | 'totalAmount' | 'status'>) => {
    if (!client) return null;
    try {
      const query = fql`
        clients.create({
          name: ${data.name},
          email: ${data.email},
          phone: ${data.phone},
          company: ${data.company},
          vatNumber: ${data.vatNumber},
          totalInvoices: 0,
          totalAmount: 0,
          status: "active"
        })
      `;
      const result = await client.query(query);
      const document = extractFaunaData<Client>(result)[0];
      return document ? { id: document.ref.id, ...document.data } : null;
    } catch (error) {
      return null;
    }
  },

  createProvider: async (data: Omit<Provider, 'id'>) => {
    if (!client) return null;
    try {
      const query = fql`
        providers.create({
          name: ${data.name},
          email: ${data.email},
          phone: ${data.phone},
          service: ${data.service},
          availability: ${data.availability},
          rating: ${data.rating},
          specialties: ${data.specialties}
        })
      `;
      const result = await client.query(query);
      const document = extractFaunaData<Provider>(result)[0];
      return document ? { id: document.ref.id, ...document.data } : null;
    } catch (error) {
      return null;
    }
  },

  createInvoice: async (data: Omit<Invoice, 'id'>): Promise<Invoice | null> => {
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
        })),
        totalAmount: Number(document.data.totalAmount?.['@int'] || 0),
        tax: Number(document.data.tax?.['@int'] || 0)
      } : null;
    } catch (error) {
      console.error('Error creating invoice:', error);
      return null;
    }
  },

  deleteInvoice: async (id: string): Promise<boolean> => {
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
});

export const businessQueries = createBusinessQueries(getFaunaClient());