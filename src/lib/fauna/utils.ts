import { QueryValue, QueryValueObject } from 'fauna';

export const extractFaunaData = <T>(result: QueryValue): T[] => {
  if (!result || typeof result !== 'object') return [];
  
  const resultObj = result as QueryValueObject;

  // Handle Set response
  if (resultObj.data?.['@set']?.data) {
    return resultObj.data['@set'].data.map((item: any) => {
      if (item['@doc']) {
        return normalizeDocument(item['@doc']);
      }
      return normalizeDocument(item);
    });
  }

  // Handle direct document response
  if (resultObj.data?.['@doc']) {
    return [normalizeDocument(resultObj.data['@doc'])];
  }

  // Handle array response
  if (Array.isArray(resultObj.data)) {
    return resultObj.data.map((item: any) => {
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
  
  Object.keys(normalized).forEach(key => {
    // Convert Fauna number types
    if (normalized[key]?.['@int']) {
      normalized[key] = Number(normalized[key]['@int']);
    }
    if (normalized[key]?.['@double']) {
      normalized[key] = Number(normalized[key]['@double']);
    }
    
    // Convert Fauna time
    if (normalized[key]?.['@time']) {
      normalized[key] = new Date(normalized[key]['@time']).toISOString();
    }
    
    // Remove Fauna metadata fields
    if (key === '@ts' || key === '@ref') {
      delete normalized[key];
    }
  });

  return normalized;
};

export const handleFaunaError = (error: any) => {
  console.error('Fauna query error:', error);
  throw error;
};