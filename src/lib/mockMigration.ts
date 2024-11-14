import { businessQueries } from './fauna/business';
import fallbackDb from './fallback-db.json';

export const migrateData = async () => {
  // Migrate Clients
  for (const client of fallbackDb.clients) {
    const { id, totalInvoices, totalAmount, ...clientData } = client;
    await businessQueries.createClient(clientData);
  }

  // Migrate Providers
  for (const provider of fallbackDb.providers) {
    const { id, ...providerData } = provider;
    await businessQueries.createProvider(providerData);
  }

  // Migrate Invoices
  for (const invoice of fallbackDb.invoices) {
    const { id, ...invoiceData } = invoice;
    await businessQueries.createInvoice(invoiceData);
  }
};