import { emailQueries } from './emailQueries';
import { contentQueries } from './contentQueries';

export const faunaQueries = {
  ...emailQueries,
  ...contentQueries
};

export type { EmailData } from './emailQueries';
export type { ContentData } from './contentQueries';