import { format, isValid, parseISO } from "date-fns";

export const formatSafeDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Invalid date';
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'PPP') : 'Invalid date';
  } catch (error) {
    return 'Invalid date';
  }
};