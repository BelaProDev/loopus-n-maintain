import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { dropboxAuth } from '@/lib/auth/dropbox';
import { useAppDispatch } from '@/hooks/useAppStore';
import { setAuthenticated } from '@/store/slices/documentsSlice';
import { Loader2 } from 'lucide-react';

const DropboxCallback = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const storedState = localStorage.getItem('dropbox_state');
        
        if (!code) {
          throw new Error('No authorization code received');
        }

        if (state !== storedState) {
          throw new Error('Invalid state parameter');
        }

        const accessToken = await dropboxAuth.handleCallback(code);
        
        if (accessToken) {
          dispatch(setAuthenticated(true));
          toast({
            title: 'Success',
            description: 'Successfully connected to Dropbox',
          });
          navigate('/dropbox-explorer');
        }
      } catch (error) {
        console.error('Auth error:', error);
        toast({
          title: 'Authentication Error',
          description: error instanceof Error ? error.message : 'Failed to complete authentication',
          variant: 'destructive',
        });
        navigate('/dropbox-explorer');
      }
    };

    handleAuth();
  }, [toast, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10">
      <div className="text-center space-y-4 p-6 max-w-md mx-auto">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-500" />
        <h1 className="text-2xl font-bold">Connecting to Dropbox...</h1>
        <p className="text-muted-foreground">
          Please wait while we complete the authentication process.
        </p>
      </div>
    </div>
  );
};

export default DropboxCallback;