import { getFaunaClient, executeQuery } from './fauna/client';
export { fallbackQueries as faunaQueries } from './db/fallbackDb';
export { businessQueries } from './db/businessDb';
export { settingsQueries } from './db/settingsDb';

// Export the client function that returns the FaunaDB client
export const client = getFaunaClient;
export { executeQuery };