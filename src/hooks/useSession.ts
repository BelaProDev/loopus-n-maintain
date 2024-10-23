import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useSession = () => {
  const { isAuthenticated } = useAuth();
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const checkSession = () => {
      const session = localStorage.getItem('craft_coordination_session');
      setSessionChecked(true);
      return !!session;
    };

    checkSession();
  }, [isAuthenticated]);

  return { sessionChecked };
};