import { Handler } from '@netlify/functions';
import { Client, fql } from 'fauna';

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
        body: JSON.stringify({ error: 'No token found' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.data)
    };
  } catch (error) {
    console.error('Token retrieval error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve token' })
    };
  }
};

export { handler };