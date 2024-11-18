interface FaunaDocument<T> {
  ref: { id: string };
  data: T;
  ts?: { isoString?: string };
}

interface FaunaResponse<T> {
  data: {
    data: Array<{
      id: string;
      ts: { isoString: string };
      [key: string]: any;
    }>;
    static_type?: string;
  };
}

export type { FaunaDocument };

export const extractFaunaData = <T>(response: FaunaResponse<T>): FaunaDocument<T>[] => {
  if (!response?.data?.data) return [];

  return response.data.data.map((item) => ({
    ref: { id: item.id },
    data: normalizeDocData(item) as T,
    ts: { isoString: item.ts?.isoString }
  }));
};

const normalizeDocData = (doc: Record<string, any>): any => {
  const normalized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(doc)) {
    if (key === 'id' || key === 'ts' || key === 'coll') continue;
    
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