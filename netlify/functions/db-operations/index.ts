import { Handler } from '@netlify/functions';
import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

async function getConnection() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
}

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { operation, table, data } = JSON.parse(event.body || '{}');
    const pool = await getConnection();
    
    let result;
    switch (operation) {
      case 'find':
        [result] = await pool.query(`SELECT * FROM ${table} WHERE ?`, data.query || {});
        break;
      case 'findOne':
        [[result]] = await pool.query(`SELECT * FROM ${table} WHERE ? LIMIT 1`, data.query || {});
        break;
      case 'insertOne':
        [result] = await pool.query(`INSERT INTO ${table} SET ?`, data);
        break;
      case 'updateOne':
        [result] = await pool.query(`UPDATE ${table} SET ? WHERE ?`, [data.update, data.query]);
        break;
      case 'deleteOne':
        [result] = await pool.query(`DELETE FROM ${table} WHERE ?`, data.query);
        break;
      default:
        throw new Error('Invalid operation');
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Database operation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};

export { handler };