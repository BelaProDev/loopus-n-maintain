import { clientQueries } from './clientQueries';
import { providerQueries } from './providerQueries';
import { invoiceQueries } from './invoiceQueries';

export const businessQueries = {
  ...clientQueries,
  ...providerQueries,
  ...invoiceQueries
};