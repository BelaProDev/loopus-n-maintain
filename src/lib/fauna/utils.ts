interface FaunaDocument<T> {
  ref: { id: string };
  data: T;
  ts?: { isoString?: string };
}

interface FaunaResponse<T> {
  data: {
    '@set'?: {
      data: Array<{
        '@doc': {
          id: string;
          ts: { '@time': string };
          [key: string]: any;
        };
      }>;
    };
    data?: T[];
    id?: string;
    ts?: { isoString?: string };
    ref?: { id: string };
  } & T;
  static_type?: string;
}

export type { FaunaDocument };

export const extractFaunaData = <T>(response: FaunaResponse<T>): FaunaDocument<T>[] => {
  if (!response) return [];

  // Handle Set response format with @set structure
  if (response.data?.['@set']?.data) {
    return response.data['@set'].data.map((item) => ({
      ref: { id: item['@doc'].id },
      data: normalizeDocData(item['@doc']) as T,
      ts: { isoString: item['@doc'].ts?.['@time'] }
    }));
  }

  // Handle Set response format
  if (response.data?.data) {
    return response.data.data.map((item) => normalizeDocument<T>(item));
  }

  // Handle direct document response
  if (response.data) {
    const normalized = normalizeDocument<T>(response.data);
    return normalized ? [normalized] : [];
  }

  return [];
};

const normalizeDocument = <T>(doc: any): FaunaDocument<T> => {
  if (!doc) return null as any;

  const normalized: FaunaDocument<T> = {
    ref: { id: doc.id || doc.ref?.id || '' },
    data: normalizeDocData(doc) as T
  };

  if (doc.ts?.isoString) {
    normalized.ts = { isoString: doc.ts.isoString };
  }

  return normalized;
};

const normalizeDocData = (doc: Record<string, any>): any => {
  const normalized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(doc)) {
    if (key === 'id' || key === 'ts' || key === 'coll') continue;
    
    if (value && typeof value === 'object') {
      if ('@time' in value) {
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