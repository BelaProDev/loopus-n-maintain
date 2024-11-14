import { QuerySuccess } from 'fauna';

export const extractFaunaData = <T>(result: any): T[] => {
  if (!result?.data) return [];
  
  // Handle Set response format
  if (result.data['@set']) {
    return result.data['@set'].data.map((item: any) => {
      if (item['@doc']) {
        const doc = item['@doc'];
        // Convert Fauna specific number format
        Object.keys(doc).forEach(key => {
          if (doc[key]?.['@int']) {
            doc[key] = Number(doc[key]['@int']);
          }
        });
        return doc;
      }
      return item;
    });
  }
  
  // Handle direct document response
  if (result.data['@doc']) {
    const doc = result.data['@doc'];
    Object.keys(doc).forEach(key => {
      if (doc[key]?.['@int']) {
        doc[key] = Number(doc[key]['@int']);
      }
    });
    return [doc];
  }

  // Handle array response
  if (Array.isArray(result.data)) {
    return result.data.map((item: any) => {
      if (item['@doc']) {
        const doc = item['@doc'];
        Object.keys(doc).forEach(key => {
          if (doc[key]?.['@int']) {
            doc[key] = Number(doc[key]['@int']);
          }
        });
        return doc;
      }
      return item;
    });
  }

  return [];
};

export const handleFaunaError = (error: any) => {
  console.error('Fauna query error:', error);
  throw error;
};