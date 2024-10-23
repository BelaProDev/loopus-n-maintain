import { Handler } from '@netlify/functions';
import { Client, query as q } from 'faunadb';

const client = new Client({
  secret: process.env.FAUNA_SECRET_KEY || '',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    switch (event.httpMethod) {
      case 'GET': {
        const result = await client.query(
          q.Map(
            q.Paginate(q.Documents(q.Collection('services'))),
            q.Lambda('ref', q.Get(q.Var('ref')))
          )
        );
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify(result),
        };
      }

      case 'POST': {
        const data = JSON.parse(event.body || '{}');
        const result = await client.query(
          q.Create(q.Collection('services'), { data })
        );
        return {
          statusCode: 201,
          headers: corsHeaders,
          body: JSON.stringify(result),
        };
      }

      default:
        return {
          statusCode: 405,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export { handler };