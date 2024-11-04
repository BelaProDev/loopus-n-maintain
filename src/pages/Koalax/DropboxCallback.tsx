import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { dropboxAuth } from '@/lib/auth/dropbox';
import { useDropboxManager } from '@/hooks/useDropboxManager';

const DropboxCallback = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useDropboxManager('/');

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        if (!code) {
          throw new Error('No authorization code received');
        }

        const accessToken = await dropboxAuth.handleCallback(code);
        
        if (accessToken) {
          setIsAuthenticated(true);
          toast({
            title: 'Success',
            description: 'Successfully connected to Dropbox',
          });
        }
      } catch (error) {
        console.error('Auth error:', error);
        toast({
          title: 'Authentication Error',
          description: error instanceof Error ? error.message : 'Failed to complete authentication',
          variant: 'destructive',
        });
      } finally {
        // Always redirect back to documents page
        navigate('/koalax/documents', { replace: true });
      }
    };

    handleAuth();
  }, [toast, navigate, setIsAuthenticated]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4 p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold">Connecting to Dropbox...</h1>
        <p className="text-muted-foreground">
          Please wait while we complete the authentication process.
        </p>
      </div>
    </div>
  );
};

export default DropboxCallback;