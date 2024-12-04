import type { FaunaDocument, FaunaResponse } from '@/types/fauna';

export const extractFaunaData = <T>(response: unknown): T[] => {
  if (!response) return [];

  const faunaResponse = response as FaunaResponse<T>;

  if (Array.isArray(faunaResponse.data)) {
    return faunaResponse.data.map((doc: FaunaDocument<T>) => ({
      id: doc.ref.id,
      ...doc.data
    })) as T[];
  }

  if (faunaResponse.data && 'ref' in faunaResponse.data) {
    return [{
      id: faunaResponse.data.ref.id,
      ...faunaResponse.data.data
    }] as T[];
  }

  return [];
};

export const normalizeDocData = <T>(doc: FaunaDocument<T>): T & { id: string } => {
  if (!doc) return {} as T & { id: string };
  
  return {
    id: doc.ref.id,
    ...doc.data,
    createdAt: doc.ts ? new Date(doc.ts / 1000).toISOString() : undefined
  } as T & { id: string };
};