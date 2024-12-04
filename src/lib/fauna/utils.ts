export interface FaunaDocument<T> {
  ref: { id: string };
  data: T;
  ts?: number;
}

export interface FaunaResponse<T> {
  data: Array<FaunaDocument<T>> | FaunaDocument<T>;
}

export const extractFaunaData = <T>(response: FaunaResponse<T> | null): T[] => {
  if (!response) return [];

  // Handle array response
  if (Array.isArray(response.data)) {
    return response.data.map(doc => ({
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

export const normalizeDocData = <T>(doc: any): T => {
  if (!doc) return {} as T;
  
  const normalized: any = { ...doc };
  
  if (doc.ts) {
    normalized.createdAt = new Date(doc.ts / 1000).toISOString();
  }
  
  // Remove internal Fauna properties
  delete normalized.ref;
  delete normalized.ts;
  
  return normalized as T;
};