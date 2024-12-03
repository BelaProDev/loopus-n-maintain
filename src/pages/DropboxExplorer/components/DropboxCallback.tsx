import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { dropboxAuth } from '@/lib/auth/dropboxAuth';
import { toast } from 'sonner';

export const DropboxCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const storedState = localStorage.getItem('dropbox_state');

      if (error) {
        toast.error('Authentication failed');
        navigate('/dropbox-explorer');
        return;
      }

      if (!code || !state || state !== storedState) {
        toast.error('Invalid authentication response');
        navigate('/dropbox-explorer');
        return;
      }

      try {
        if (!user) throw new Error('User not authenticated');
        await dropboxAuth.handleCallback(code, user.toString());
        toast.success('Successfully connected to Dropbox');
        navigate('/dropbox-explorer');
      } catch (error) {
        console.error('Callback error:', error);
        toast.error('Failed to complete authentication');
        navigate('/dropbox-explorer');
      }
    };

    handleCallback();
  }, [searchParams, navigate, user]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Completing authentication...</p>
    </div>
  );
};