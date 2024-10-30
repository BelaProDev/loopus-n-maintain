import { useState, useEffect } from 'react';

export function useSession() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      // For now, just simulate a session check
      setIsAuthenticated(true);
      setSessionChecked(true);
    };

    checkSession();
  }, []);

  return { sessionChecked, isAuthenticated };
}