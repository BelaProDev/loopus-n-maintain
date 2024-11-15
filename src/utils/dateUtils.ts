import { format, isValid, parseISO } from "date-fns";

export const formatSafeDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Invalid date';
  try {
    // First try parsing as ISO string
    let date = parseISO(dateString);
    
    // If invalid, try parsing as timestamp
    if (!isValid(date)) {
      date = new Date(Number(dateString));
    }
    
    // If still invalid, try parsing as regular date string
    if (!isValid(date)) {
      date = new Date(dateString);
    }
    
    return isValid(date) ? format(date, 'PPP') : 'Invalid date';
  } catch (error) {
    return 'Invalid date';
  }
};