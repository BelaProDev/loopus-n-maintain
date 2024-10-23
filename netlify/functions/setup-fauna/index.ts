import { Handler } from '@netlify/functions';
import { Client, query as q } from 'faunadb';

const client = new Client({
  secret: process.env.FAUNA_SECRET_KEY || '',
});

const handler: Handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    // Create collections
    await client.query(
      q.CreateCollection({ name: 'users' })
    );
    await client.query(
      q.CreateCollection({ name: 'services' })
    );

    // Create indexes
    await client.query(
      q.CreateIndex({
        name: 'users_by_email',
        source: q.Collection('users'),
        terms: [{ field: ['data', 'email'] }],
        unique: true,
      })
    );

    await client.query(
      q.CreateIndex({
        name: 'services_by_type',
        source: q.Collection('services'),
        terms: [{ field: ['data', 'type'] }],
      })
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Database setup completed' }),
    };
  } catch (error) {
    console.error('Setup error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to setup database' }),
    };
  }
};

export { handler };