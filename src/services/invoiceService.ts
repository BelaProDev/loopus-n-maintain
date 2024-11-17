import { businessQueries } from '@/lib/fauna/business';
import type { CreateInvoiceDTO, Invoice, InvoiceItem } from '@/types/invoice';

export const invoiceService = {
  generateInvoiceNumber: () => `INV-${Date.now()}`,

  calculateTotals: (items: InvoiceItem[]) => {
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
    const tax = items.reduce((sum, item) => sum + (item.total * item.vatRate / 100), 0);
    return { totalAmount, tax };
  },

  prepareInvoiceData: (dto: CreateInvoiceDTO): Omit<Invoice, 'id'> => {
    const { totalAmount, tax } = invoiceService.calculateTotals(dto.items);
    
    return {
      ...dto,
      number: invoiceService.generateInvoiceNumber(),
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'draft',
      totalAmount,
      tax,
      paymentTerms: dto.paymentTerms || 'net30',
      currency: dto.currency || 'EUR',
      items: dto.items.map(item => ({ 
        ...item,
        id: item.id || crypto.randomUUID(),
        sku: item.sku || '',
        unit: item.unit || 'unit',
        vatRate: item.vatRate || 21,
        total: item.quantity * item.unitPrice,
        [Symbol.iterator]: undefined
      }))
    };
  },

  createInvoice: async (dto: CreateInvoiceDTO) => {
    const invoiceData = invoiceService.prepareInvoiceData(dto);
    return businessQueries.createInvoice(invoiceData);
  },

  updateInvoice: async (id: string, dto: CreateInvoiceDTO) => {
    const invoiceData = invoiceService.prepareInvoiceData(dto);
    return businessQueries.updateInvoice(id, invoiceData);
  },

  deleteInvoice: (id: string) => {
    return businessQueries.deleteInvoice(id);
  },

  getInvoices: () => {
    return businessQueries.getInvoices();
  },

  getInvoiceById: (id: string) => {
    return businessQueries.getInvoiceById(id);
  }
};