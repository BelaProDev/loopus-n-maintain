export const handleFaunaError = (error: any, fallbackData: any) => {
  console.error('Fauna DB Error:', error);
  return fallbackData;
};