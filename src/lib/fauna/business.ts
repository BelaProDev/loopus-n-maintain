import { clientQueries } from './queries/clientQueries';
import { providerQueries } from './queries/providerQueries';
import { invoiceQueries } from './queries/invoiceQueries';

export const businessQueries = {
  ...clientQueries,
  ...providerQueries,
  ...invoiceQueries
};