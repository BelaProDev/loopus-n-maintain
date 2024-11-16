import { Handler } from '@netlify/functions';
import { Client, fql } from 'fauna';

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

const handler: Handler = async () => {
  try {
    const client = new Client({
      secret: process.env.VITE_FAUNA_SECRET_KEY || ''
    });

    const query = fql`
      let tokenDoc = dropbox_tokens.firstWhere(.type == "default")
      if (tokenDoc != null) {
        {
          token: tokenDoc.access_token,
          refresh_token: tokenDoc.refresh_token,
          expiry: tokenDoc.expiry
        }
      } else {
        null
      }
    `;

    const result = await client.query(query);

    if (!result.data) {
      return {
        statusCode: 404,
        body: JSON.stringify({ 
          error: 'No token found',
          code: 'NO_TOKEN'
        })
      };
    }

    // Check if token needs refresh (5 minutes buffer)
    if (result.data.expiry < Date.now() + 300000) {
      try {
        const newTokens = await refreshAccessToken(result.data.refresh_token);
        
        // Store new tokens
        await fetch('/.netlify/functions/store-dropbox-token', {
          method: 'POST',
          body: JSON.stringify(newTokens)
        });

        return {
          statusCode: 200,
          body: JSON.stringify({
            ...newTokens,
            message: 'Token refreshed and stored successfully'
          })
        };
      } catch (refreshError) {
        return {
          statusCode: 401,
          body: JSON.stringify({ 
            error: 'Token refresh failed',
            code: 'REFRESH_FAILED',
            details: refreshError instanceof Error ? refreshError.message : 'Unknown error'
          })
        };
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        access_token: result.data.token,
        refresh_token: result.data.refresh_token,
        expiry: result.data.expiry,
        message: 'Token retrieved successfully'
      })
    };
  } catch (error) {
    console.error('Token retrieval error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to retrieve token',
        code: 'RETRIEVAL_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};

export { handler };