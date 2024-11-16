import { useEffect } from 'react';

const DropboxCallback = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

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