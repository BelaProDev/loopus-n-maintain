import { emailQueries } from './emailQueries';
import { contentQueries } from './contentQueries';
import { getFaunaClient } from './utils';

export const faunaQueries = {
  ...emailQueries,
  ...contentQueries
};

export { getFaunaClient as client };