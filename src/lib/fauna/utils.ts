export interface FaunaDocument<T> {
  ref: { id: string };
  data: T;
  ts?: number;
}

export interface FaunaResponse<T> {
  data: Array<FaunaDocument<T>> | FaunaDocument<T>;
}

export const extractFaunaData = <T>(response: any): T[] => {
  if (!response) return [];

  // Handle array response
  if (Array.isArray(response.data)) {
    return response.data.map((doc: FaunaDocument<T>) => ({
      id: doc.ref.id,
      ...doc.data
    })) as T[];
  }

  // Handle single document response
  if (response.data && 'ref' in response.data) {
    return [{
      id: response.data.ref.id,
      ...response.data.data
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