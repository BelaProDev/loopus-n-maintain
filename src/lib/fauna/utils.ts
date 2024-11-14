import { QueryValue, QueryValueObject } from 'fauna';

interface FaunaDocument<T> {
  ref: { id: string };
  data: T;
}

export const extractFaunaData = <T>(result: QueryValue): FaunaDocument<T>[] => {
  if (!result || typeof result !== 'object') return [];
  
  const resultObj = result as QueryValueObject;

  // Handle Set response
  if (resultObj.data?.['@set']?.data) {
    return resultObj.data['@set'].data.map((item: any) => ({
      ref: { id: item['@doc']?.id || item.id },
      data: normalizeDocument(item['@doc'] || item)
    }));
  }

  // Handle direct document response
  if (resultObj.data?.['@doc']) {
    return [{
      ref: { id: resultObj.data['@doc'].id },
      data: normalizeDocument(resultObj.data['@doc'])
    }];
  }

  // Handle array response
  if (Array.isArray(resultObj.data)) {
    return resultObj.data.map((item: any) => ({
      ref: { id: item['@doc']?.id || item.id },
      data: normalizeDocument(item['@doc'] || item)
    }));
  }

  return [];
};

const normalizeDocument = (doc: any): any => {
  const normalized = { ...doc };
  
  // Remove Fauna metadata fields
  delete normalized.id;
  delete normalized.coll;
  delete normalized.ts;
  
  // Convert Fauna time types
  Object.keys(normalized).forEach(key => {
    if (normalized[key]?.['@time']) {
      normalized[key] = new Date(normalized[key]['@time']).toISOString();
    }
  });

  return normalized;
};

export const handleFaunaError = (error: any) => {
  console.error('Fauna query error:', error);
  throw error;
};