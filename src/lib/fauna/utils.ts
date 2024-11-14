import { QueryValue } from 'fauna';

export const extractFaunaData = <T>(result: QueryValue): T[] => {
  if (!result) return [];

  // Handle Set response
  if (result.data?.['@set']?.data) {
    return result.data['@set'].data.map((item: any) => {
      if (item['@doc']) {
        return normalizeDocument(item['@doc']);
      }
      return normalizeDocument(item);
    });
  }

  // Handle direct document response
  if (result.data?.['@doc']) {
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