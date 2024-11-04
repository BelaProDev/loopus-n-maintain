export { fallbackQueries as faunaQueries } from './db/fallbackDb';
export { businessQueries } from './db/businessDb';
export { settingsQueries } from './db/settingsDb';

// Keep this for compatibility with existing code
export const client = () => null;
