import { Client } from 'fauna';

interface FaunaDocument<T> {
  ref: { id: string };
  data: T;
  ts?: { isoString?: string };
}

interface FaunaResponse<T> {
  data: {
    data?: T[];
  } & T;
  static_type?: string;
}

export const extractFaunaData = <T>(response: FaunaResponse<T>): FaunaDocument<T>[] => {
  if (!response) return [];

  // Handle Set response format
  if (response.data?.data) {
    return response.data.data.map(normalizeDocument);
  }

  // Handle direct document response
  if (response.data) {
    const normalized = normalizeDocument(response.data);
    return normalized ? [normalized] : [];
  }

  // Handle array response
  if (Array.isArray(response)) {
    return response.map(normalizeDocument);
  }

  return [];
};

const normalizeDocument = <T>(doc: any): FaunaDocument<T> => {
  if (!doc) return null as any;

  const normalized: FaunaDocument<T> = {
    ref: { id: doc.id || doc.ref?.id },
    data: { ...doc }
  };

  // Remove Fauna metadata from data
  delete normalized.data.id;
  delete normalized.data.ref;
  delete normalized.data.ts;
  delete normalized.data.coll;

  return normalized;
};

export const handleFaunaError = (error: any, fallbackData: any) => {
  return fallbackData;
};