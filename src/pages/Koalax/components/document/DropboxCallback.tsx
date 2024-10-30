import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const DropboxCallback = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      if (window.opener) {
        window.opener.postMessage({ type: 'DROPBOX_AUTH_CODE', code }, '*');
        window.close();
      } else {
        toast({
          title: "Authentication Error",
          description: "Could not complete authentication. Please try again.",
          variant: "destructive",
        });
        navigate('/koalax');
      }
    }
  }, [searchParams, toast, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4 p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold">Authentication Successful</h1>
        <p className="text-muted-foreground">
          You can close this window and return to the main application.
        </p>
      </div>
    </div>
  );
};

export default DropboxCallback;