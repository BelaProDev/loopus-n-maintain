import { QueryValue, QueryValueObject } from 'fauna';

interface FaunaDocument<T> {
  ref: { id: string };
  data: T;
}

export const extractFaunaData = <T>(result: QueryValue): FaunaDocument<T>[] => {
  if (!result || typeof result !== 'object') return [];
  
  const resultObj = result as QueryValueObject;
  
  // Handle the new response format where data is nested in data.data
  if (resultObj.data?.data && Array.isArray(resultObj.data.data)) {
    return resultObj.data.data.map((item: any) => ({
      ref: { id: item.id },
      data: normalizeDocument(item)
    }));
  }

  // Handle Set response (keeping for backwards compatibility)
  if (resultObj.data?.['@set']?.data) {
    return resultObj.data['@set'].data.map((item: any) => ({
      ref: { id: item['@doc'].id },
      data: normalizeDocument(item['@doc'])
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
  
  // Convert Fauna time types to ISO strings
  Object.keys(normalized).forEach(key => {
    if (normalized[key]?.isoString) {
      normalized[key] = normalized[key].isoString;
    }
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
