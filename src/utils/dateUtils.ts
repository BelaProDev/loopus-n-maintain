export const formatChatTimestamp = (timestamp: any): string => {
  try {
    // Handle Fauna timestamp object format
    if (timestamp && typeof timestamp === 'object' && 'isoString' in timestamp) {
      return new Date(timestamp.isoString).toISOString();
    }
    
    // Handle string timestamp
    if (typeof timestamp === 'string') {
      return new Date(timestamp).toISOString();
    }
    
    // Handle Date object
    if (timestamp instanceof Date) {
      return timestamp.toISOString();
    }
    
    // Default fallback
    return new Date().toISOString();
  } catch (error) {
    console.warn('Invalid timestamp format:', timestamp);
    return new Date().toISOString();
  }
};

export const formatSafeDate = (date: string | Date | null): string => {
  if (!date) return '-';
  try {
    return new Date(date).toLocaleDateString();
  } catch (error) {
    console.warn('Invalid date format:', date);
    return '-';
  }
};