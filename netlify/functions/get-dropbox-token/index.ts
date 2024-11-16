import { Handler } from '@netlify/functions';

const DROPBOX_TOKEN_URL = "https://api.dropboxapi.com/oauth2/token";
const CLIENT_ID = process.env.VITE_DROPBOX_APP_KEY;
const CLIENT_SECRET = process.env.VITE_DROPBOX_APP_SECRET;

const refreshAccessToken = async (refresh_token: string) => {
  const response = await fetch(DROPBOX_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
      client_id: CLIENT_ID || '',
      client_secret: CLIENT_SECRET || ''
    })
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token || refresh_token,
    expiry: Date.now() + (data.expires_in * 1000)
  };
};

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method not allowed' }) 
    };
  }

  try {
    const { refresh_token } = JSON.parse(event.body || '{}');
    
    if (!refresh_token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Refresh token is required',
          code: 'INVALID_TOKEN'
        })
      };
    }

    const tokens = await refreshAccessToken(refresh_token);
    
    return {
      statusCode: 200,
      body: JSON.stringify(tokens)
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to refresh token',
        code: 'REFRESH_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};

export { handler };