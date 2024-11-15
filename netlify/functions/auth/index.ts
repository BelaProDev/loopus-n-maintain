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
  const hash = SHA256(password).toString().toLowerCase();
  console.log('Server generated hash:', hash);
  return hash;
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

    console.log('Received login attempt for email:', email);
    const client = getFaunaClient();
    const hashedPassword = hashPassword(password);
    console.log('Server hashed password:', hashedPassword);

    if (action === 'validateAdmin') {
      try {
        const query = fql`
          admin_koalax.firstWhere(.email == ${email} && .password == ${hashedPassword})
        `;
        
        const result = await client.query(query);
        console.log('Fauna query result:', result);
        
        if (!result.data) {
          console.log('No matching user found');
          return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Invalid credentials' }),
          };
        }

        console.log('User authenticated successfully');
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
      } catch (faunaError) {
        console.error('Fauna query error:', faunaError);
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Invalid credentials' }),
        };
      }
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid action' }),
    };
  } catch (error) {
    console.error('Auth error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};

export { handler };