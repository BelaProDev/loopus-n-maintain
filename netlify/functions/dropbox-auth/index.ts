import { Handler } from '@netlify/functions';
import crypto from 'crypto';

const DROPBOX_APP_KEY = process.env.VITE_DROPBOX_APP_KEY;
const DROPBOX_APP_SECRET = process.env.VITE_DROPBOX_APP_SECRET;
const REDIRECT_URI = process.env.URL ? `${process.env.URL}/dropbox-explorer/callback` : '';

const handler: Handler = async (event) => {
  if (!DROPBOX_APP_KEY || !DROPBOX_APP_SECRET || !REDIRECT_URI) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing configuration' })
    };
  }

  // Handle the initial auth request
  if (event.httpMethod === 'GET') {
    const state = crypto.randomBytes(16).toString('hex');
    const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${DROPBOX_APP_KEY}&response_type=code&redirect_uri=${REDIRECT_URI}&state=${state}&token_access_type=offline`;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ authUrl, state })
    };
  }

  // Handle the token exchange
  if (event.httpMethod === 'POST') {
    try {
      const { code } = JSON.parse(event.body || '{}');
      
      if (!code) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing authorization code' })
        };
      }

      const tokenResponse = await fetch('https://api.dropboxapi.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          client_id: DROPBOX_APP_KEY,
          client_secret: DROPBOX_APP_SECRET,
          redirect_uri: REDIRECT_URI,
        }).toString(),
      });

      const data = await tokenResponse.json();
      
      if (!tokenResponse.ok) {
        throw new Error(data.error_description || 'Failed to exchange token');
      }

      return {
        statusCode: 200,
        body: JSON.stringify(data)
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Token exchange failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        })
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};

export { handler };