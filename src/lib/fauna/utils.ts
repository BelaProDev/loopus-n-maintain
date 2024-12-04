import type { FaunaDocument, FaunaResponse } from '@/types/fauna/document';

export const extractFaunaData = <T>(response: unknown): T[] => {
  if (!response) return [];

  const faunaResponse = response as FaunaResponse<T>;

  if (Array.isArray(faunaResponse.data)) {
    return faunaResponse.data.map((item: any) => ({
      id: item.id || item.ref?.id,
      ...item.data || item
    })) as T[];
  }

  if (faunaResponse.data) {
    const data = faunaResponse.data as any;
    return [{
      id: data.id || data.ref?.id,
      ...data.data || data
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

export type { FaunaDocument, FaunaResponse };