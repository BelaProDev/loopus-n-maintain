import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { dropboxAuth } from '@/lib/auth/dropbox';

const DropboxCallback = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      if (code) {
        try {
          await dropboxAuth.exchangeCodeForToken(code);
          toast({
            title: 'Success',
            description: 'Successfully connected to Dropbox',
          });
          navigate('/koalax/documents', { replace: true });
        } catch (error) {
          toast({
            title: 'Authentication Error',
            description: 'Failed to complete authentication. Please try again.',
            variant: 'destructive',
          });
          navigate('/koalax/documents');
        }
      }
    };

    handleCallback();
  }, [searchParams, toast, navigate]);

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