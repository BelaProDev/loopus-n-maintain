import { useEffect } from 'react';
import { useDropboxAuth } from '@/hooks/useDropboxAuth';
import { useSearchParams } from 'react-router-dom';

const DropboxCallback = () => {
  const { handleCallback } = useDropboxAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleCallback(code);
    }
  }, [handleCallback, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
        <p className="text-muted-foreground">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
};

export default DropboxCallback;