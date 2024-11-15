interface FaunaDocument<T> {
  ref: { id: string };
  data: T;
  ts?: { isoString?: string };
}

interface FaunaResponse<T> {
  data: {
    data?: T[];
    id?: string;
    ts?: { isoString?: string };
    ref?: { id: string };
  } & T;
  static_type?: string;
}

export const extractFaunaData = <T>(response: FaunaResponse<T>): FaunaDocument<T>[] => {
  if (!response) return [];

  // Handle Set response format
  if (response.data?.data) {
    return response.data.data.map((item) => normalizeDocument<T>(item));
  }

  // Handle direct document response
  if (response.data) {
    const normalized = normalizeDocument<T>(response.data);
    return normalized ? [normalized] : [];
  }

  // Handle array response
  if (Array.isArray(response)) {
    return response.map((item) => normalizeDocument<T>(item));
  }

  return [];
};

const normalizeDocument = <T>(doc: any): FaunaDocument<T> => {
  if (!doc) return null as any;

  const normalized: FaunaDocument<T> = {
    ref: { id: doc.id || doc.ref?.id || '' },
    data: { ...doc } as T
  };

  if (doc.ts?.isoString) {
    normalized.ts = { isoString: doc.ts.isoString };
  }

  // Remove Fauna metadata from data
  const data = normalized.data as any;
  delete data.id;
  delete data.ref;
  delete data.ts;
  delete data.coll;

  return normalized;
};

export const handleFaunaError = (error: any, fallbackData: any) => {
  return fallbackData;
};