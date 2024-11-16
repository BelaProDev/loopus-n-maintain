import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropbox } from 'dropbox';
import { toast } from 'sonner';

const DropboxCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const hash = window.location.hash;
      if (!hash) {
        toast.error('Authentication failed');
        navigate('/dropbox-explorer');
        return;
      }

      const accessToken = hash
        .substring(1)
        .split('&')
        .find(param => param.startsWith('access_token='))
        ?.split('=')[1];

      if (!accessToken) {
        toast.error('No access token received');
        navigate('/dropbox-explorer');
        return;
      }

      window.localStorage.setItem('dropboxToken', accessToken);
      window.localStorage.removeItem('dropboxAuthPending');
      toast.success('Successfully connected to Dropbox');
      navigate('/dropbox-explorer');
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Connecting to Dropbox...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
};

export default DropboxCallback;