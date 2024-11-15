import { Handler } from '@netlify/functions';
import { Client, fql } from 'fauna';
import { SHA256 } from 'crypto-js';

const getFaunaClient = () => {
  const secret = process.env.VITE_FAUNA_SECRET_KEY;
  if (!secret) {
    throw new Error('Fauna secret key not found');
  }
  return new Client({ secret });
};

const hashPassword = (password: string): string => {
  return SHA256(password).toString().toLowerCase();
};

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { email, password, action } = JSON.parse(event.body || '{}');
    
    if (!email || !password || !action) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const client = getFaunaClient();
    const hashedPassword = hashPassword(password);

    if (action === 'validateAdmin') {
      const query = fql`
        admin_koalax.firstWhere(.email == ${email} && .password == ${hashedPassword})
      `;
      
      const result = await client.query(query);
      
      if (!result) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Invalid credentials' }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true,
          user: {
            email: result.data.email,
            role: result.data.role
          }
        }),
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid action' }),
    };
  } catch (error) {
    console.error('Auth error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export { handler };