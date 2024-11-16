import { Handler } from '@netlify/functions';
import { Client, fql } from 'fauna';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { access_token, refresh_token, expiry } = JSON.parse(event.body || '{}');
    
    if (!access_token || !refresh_token) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ 
          error: 'Missing required tokens',
          code: 'INVALID_TOKENS'
        }) 
      };
    }

    const client = new Client({
      secret: process.env.VITE_FAUNA_SECRET_KEY || ''
    });

    const query = fql`
      let existingToken = dropbox_tokens.firstWhere(.type == "default")
      if (existingToken != null) {
        existingToken.update({
          access_token: ${access_token},
          refresh_token: ${refresh_token},
          expiry: ${expiry || Date.now() + 3600000},
          updated_at: Time.now()
        })
      } else {
        dropbox_tokens.create({
          type: "default",
          access_token: ${access_token},
          refresh_token: ${refresh_token},
          expiry: ${expiry || Date.now() + 3600000},
          created_at: Time.now(),
          updated_at: Time.now()
        })
      }
    `;

    await client.query(query);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        message: 'Token stored successfully',
        expiry: expiry || Date.now() + 3600000
      })
    };
  } catch (error) {
    console.error('Token storage error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to store token',
        code: 'STORAGE_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};

export { handler };