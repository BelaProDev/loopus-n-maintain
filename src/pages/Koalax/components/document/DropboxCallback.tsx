import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { dropboxAuth } from '@/lib/auth/dropbox';

const DropboxCallback = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          throw new Error('No authorization code received');
        }

        const accessToken = await dropboxAuth.handleCallback(code);
        
        if (accessToken) {
          toast({
            title: 'Success',
            description: 'Successfully connected to Dropbox',
          });
          // Use replace to prevent back navigation issues
          navigate('/koalax/documents', { replace: true });
        }
      } catch (error) {
        toast({
          title: 'Authentication Error',
          description: error instanceof Error ? error.message : 'Failed to complete authentication',
          variant: 'destructive',
        });
        // Redirect to documents page even on error, but show the error toast
        navigate('/koalax/documents', { replace: true });
      }
    };

    handleAuth();
  }, [toast, navigate]);

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