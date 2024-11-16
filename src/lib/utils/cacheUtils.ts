export const clearCache = async (): Promise<string> => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    try {
      const messageChannel = new MessageChannel();
      
      const response = await new Promise<{ status: string }>((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data);
        };
        
        navigator.serviceWorker.controller.postMessage(
          { type: 'CLEAR_CACHE' },
          [messageChannel.port2]
        );
      });
      
      return response.status;
    } catch (error) {
      console.error('Failed to clear cache:', error);
      return 'Failed to clear cache';
    }
  }
  return 'Service Worker not available';
};