import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const DropboxCallback = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      // Send the auth code back to the opener window
      if (window.opener) {
        window.opener.postMessage({ type: 'DROPBOX_AUTH_CODE', code }, '*');
        // Close the popup after sending the message
        window.close();
      }
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4 p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold">Authentication Successful</h1>
        <p className="text-muted-foreground">
          You can close this window and return to Loopus & Maintain.
        </p>
      </div>
    </div>
  );
};

export default DropboxCallback;