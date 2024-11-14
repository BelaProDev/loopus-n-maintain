import { businessQueries } from './fauna';
import fallbackDb from './fallback-db.json';
import { toast } from '@/components/ui/use-toast';

export const migrateData = async () => {
  try {
    // Migrate Clients
    for (const client of fallbackDb.clients) {
      const { id, totalInvoices, totalAmount, status, ...clientData } = client;
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

    toast({
      title: "Success",
      description: "Mock data has been migrated successfully",
    });
  } catch (error) {
    console.error('Migration error:', error);
    toast({
      title: "Error",
      description: "Failed to migrate mock data: " + (error as Error).message,
      variant: "destructive",
    });
    throw error;
  }
};