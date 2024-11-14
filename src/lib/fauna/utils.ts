import { QuerySuccess } from 'fauna';
import { Client, Provider, Invoice } from '@/types/business';

type FaunaDocument = Client | Provider | Invoice;

export const extractFaunaData = <T extends FaunaDocument>(result: QuerySuccess<T>): T[] => {
  if (!result?.data) return [];
  
  // Handle Set response format
  if (result.data['@set']) {
    return result.data['@set'].data.map((item: any) => {
      if (item['@doc']) {
        return normalizeDocument(item['@doc']);
      }
      return normalizeDocument(item);
    });
  }
  
  // Handle direct document response
  if (result.data['@doc']) {
    return [normalizeDocument(result.data['@doc'])];
  }

  // Handle array response
  if (Array.isArray(result.data)) {
    return result.data.map((item: any) => {
      if (item['@doc']) {
        return normalizeDocument(item['@doc']);
      }
      return normalizeDocument(item);
    });
  }

  return [];
};

const normalizeDocument = (doc: any): any => {
  const normalized = { ...doc };
  
  // Remove Fauna metadata fields
  delete normalized.coll;
  delete normalized.ts;
  
  // Convert Fauna specific types
  Object.keys(normalized).forEach(key => {
    if (normalized[key]?.['@int']) {
      normalized[key] = Number(normalized[key]['@int']);
    }
    if (normalized[key]?.['@time']) {
      normalized[key] = new Date(normalized[key]['@time']).toISOString();
    }
    if (normalized[key]?.['@set']) {
      normalized[key] = normalized[key]['@set'].data.map((item: any) => normalizeDocument(item));
    }
  });
  
  return normalized;
};

export const handleFaunaError = (error: any) => {
  console.error('Fauna query error:', error);
  throw error;
};