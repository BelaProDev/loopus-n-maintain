import { useEffect } from 'react';

const DropboxCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    
    if (window.opener) {
      window.opener.postMessage({
        type: 'DROPBOX_AUTH_CALLBACK',
        code,
        state
      }, window.location.origin);
    }
  }, []);

  return (
    <div className="p-8 text-center">
      <p>Authentication complete. You can close this window.</p>
    </div>
  );
};

export default DropboxCallback;