export const formatSafeDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '-';
    
    return dateObj.toLocaleDateString();
  } catch (error) {
    return '-';
  }
};