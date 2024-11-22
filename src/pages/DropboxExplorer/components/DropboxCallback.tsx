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
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        if (error || errorDescription) {
          throw new Error(errorDescription || 'Authentication failed');
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Verify state to prevent CSRF attacks
        const savedState = localStorage.getItem('dropbox_state');
        if (state !== savedState) {
          throw new Error('Invalid state parameter');
        }

        await dropboxAuth.handleCallback(code);
        
        toast({
          title: "Success",
          description: "Successfully connected to Dropbox",
        });

        // Clean up state
        localStorage.removeItem('dropbox_state');
        
        // Close popup if in popup mode
        if (window.opener) {
          window.opener.postMessage(
            { type: 'DROPBOX_AUTH_SUCCESS' },
            window.location.origin
          );
          window.close();
        } else {
          navigate('/tools/documents');
        }
      } catch (error) {
        console.error('Auth error:', error);
        toast({
          title: "Authentication Error",
          description: error instanceof Error ? error.message : 'Failed to complete authentication',
          variant: "destructive",
        });
        navigate('/tools/documents');
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
};

export default DropboxCallback;