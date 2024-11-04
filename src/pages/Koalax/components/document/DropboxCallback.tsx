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
        const accessToken = code ? await dropboxAuth.handleCallback(code) : null;
        
        if (accessToken) {
          toast({
            title: 'Success',
            description: 'Successfully connected to Dropbox',
          });
        } else {
          throw new Error('No access token received');
        }
      } catch (error) {
        toast({
          title: 'Authentication Error',
          description: 'Failed to complete authentication. Please try again.',
          variant: 'destructive',
        });
      } finally {
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