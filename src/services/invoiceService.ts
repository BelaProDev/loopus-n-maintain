import { businessQueries } from '@/lib/fauna/business';
import type { CreateInvoiceDTO, Invoice, InvoiceItem } from '@/types/invoice';

export const invoiceService = {
  generateInvoiceNumber: () => `INV-${Date.now()}`,

  calculateTotals: (items: InvoiceItem[]) => {
    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = items.reduce((sum, item) => sum + ((item.quantity * item.unitPrice) * item.vatRate / 100), 0);
    return { totalAmount, tax };
  },

  prepareInvoiceData: (dto: CreateInvoiceDTO): Omit<Invoice, 'id'> => {
    const { totalAmount, tax } = invoiceService.calculateTotals(dto.items);
    const now = new Date();
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + 30);
    
    return {
      number: invoiceService.generateInvoiceNumber(),
      date: now.toISOString(),
      dueDate: dueDate.toISOString(),
      clientId: dto.clientId,
      providerId: dto.providerId,
      items: dto.items.map(item => ({
        ...item,
        id: item.id || crypto.randomUUID(),
        sku: item.sku || '',
        unit: item.unit || 'unit',
        vatRate: item.vatRate || 21,
        total: Number(item.quantity) * Number(item.unitPrice)
      })),
      status: 'draft',
      totalAmount,
      tax,
      notes: dto.notes || '',
      paymentTerms: dto.paymentTerms || 'net30',
      currency: dto.currency || 'EUR'
    };
  },

  createInvoice: async (dto: CreateInvoiceDTO) => {
    try {
      const invoiceData = invoiceService.prepareInvoiceData(dto);
      const result = await businessQueries.createInvoice(invoiceData);
      if (!result) {
        throw new Error('Failed to create invoice');
      }
      return result;
    } catch (error) {
      console.error('Create invoice error:', error);
      throw error;
    }
  },

  updateInvoice: async (id: string, dto: CreateInvoiceDTO) => {
    try {
      const invoiceData = invoiceService.prepareInvoiceData(dto);
      const result = await businessQueries.updateInvoice(id, invoiceData);
      if (!result) {
        throw new Error('Failed to update invoice');
      }
      return result;
    } catch (error) {
      console.error('Update invoice error:', error);
      throw error;
    }
  },

  deleteInvoice: async (id: string) => {
    try {
      const result = await businessQueries.deleteInvoice(id);
      if (!result) {
        throw new Error('Failed to delete invoice');
      }
      return result;
    } catch (error) {
      console.error('Delete invoice error:', error);
      throw error;
    }
  },

  getInvoices: async () => {
    try {
      const invoices = await businessQueries.getInvoices();
      return invoices || [];
    } catch (error) {
      console.error('Get invoices error:', error);
      throw error;
    }
  },

  getInvoiceById: async (id: string) => {
    try {
      const invoice = await businessQueries.getInvoiceById(id);
      if (!invoice) {
        throw new Error('Invoice not found');
      }
      return invoice;
    } catch (error) {
      console.error('Get invoice by id error:', error);
      throw error;
    }
  }
};