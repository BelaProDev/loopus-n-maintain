interface FaunaDocument<T> {
  ref: { id: string };
  data: T;
  ts?: { isoString?: string };
}

interface FaunaResponse<T> {
  data: FaunaDocument<T>[];
}

export type { FaunaDocument, FaunaResponse };

export const extractFaunaData = <T>(response: any): FaunaDocument<T>[] => {
  if (!response) return [];

  // Handle single document response
  if (response.ref && response.data) {
    return [{
      ref: { id: response.ref.id },
      data: normalizeDocData(response.data) as T,
      ts: response.ts ? { isoString: response.ts } : undefined
    }];
  }

  // Handle multiple documents response
  if (Array.isArray(response.data)) {
    return response.data.map((item: any) => ({
      ref: { id: item.ref.id },
      data: normalizeDocData(item.data) as T,
      ts: item.ts ? { isoString: item.ts } : undefined
    }));
  }

  return [];
};

const normalizeDocData = (doc: Record<string, any>): any => {
  if (!doc) return null;
  
  const normalized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(doc)) {
    if (key === 'ref' || key === 'ts') continue;
    
    if (value && typeof value === 'object') {
      if ('isoString' in value) {
        normalized[key] = value.isoString;
      } else if ('@time' in value) {
        normalized[key] = new Date(value['@time']).toISOString();
      } else if ('@int' in value) {
        normalized[key] = parseInt(value['@int'], 10);
      } else if (Array.isArray(value)) {
        normalized[key] = value.map(item => 
          typeof item === 'object' && item !== null ? normalizeDocData(item) : item
        );
      } else {
        normalized[key] = normalizeDocData(value);
      }
    } else {
      normalized[key] = value;
    }
  }
  
  return normalized;
};