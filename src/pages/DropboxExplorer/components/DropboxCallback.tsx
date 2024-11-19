import { useEffect } from 'react';

const DropboxCallback = () => {
  useEffect(() => {
    const processAuth = () => {
      const hash = window.location.hash;
      const search = window.location.search;

      // Handle token flow (callback auth)
      if (hash) {
        const accessToken = hash
          .substring(1)
          .split('&')
          .find(param => param.startsWith('access_token='))
          ?.split('=')[1];

        if (accessToken) {
          window.opener.postMessage(
            { type: 'DROPBOX_AUTH_SUCCESS', accessToken },
            window.location.origin
          );
        }
      }
      // Handle code flow (offline auth)
      else if (search) {
        const params = new URLSearchParams(search);
        const code = params.get('code');
        const state = params.get('state');

        if (code && state) {
          window.opener.postMessage(
            { type: 'DROPBOX_AUTH_CODE', code, state },
            window.location.origin
          );
        }
      }
    };

    processAuth();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Connecting to Dropbox...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
};

export default DropboxCallback;