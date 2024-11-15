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
  console.log('[Auth Function] Server generated hash:', hash);
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

    console.log('[Auth Function] Login attempt:', { email, action });
    const client = getFaunaClient();
    const hashedPassword = hashPassword(password);
    console.log('[Auth Function] Attempting query with hash:', hashedPassword);

    if (action === 'validateAdmin') {
      try {
        // Log the collection contents for debugging
        const debugQuery = fql`admin_koalax.all()`;
        const debugResult = await client.query(debugQuery);
        console.log('[Auth Function] All admin users:', JSON.stringify(debugResult, null, 2));

        // Original authentication query
        const query = fql`
          let user = admin_koalax.firstWhere(.email == ${email})
          if (user == null) {
            null
          } else if (user.password == ${hashedPassword}) {
            user
          } else {
            null
          }
        `;
        
        const result = await client.query(query);
        console.log('[Auth Function] Query result:', JSON.stringify(result, null, 2));
        
        if (!result.data) {
          console.log('[Auth Function] No matching user found');
          return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Invalid credentials' }),
          };
        }

        console.log('[Auth Function] User authenticated successfully');
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
        console.error('[Auth Function] Fauna query error:', faunaError);
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
    console.error('[Auth Function] Auth error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};

export { handler };