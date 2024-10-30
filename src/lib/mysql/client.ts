import mysql from 'mysql2/promise';
import { withAsyncHandler } from '../asyncUtils';
import { fallbackDB } from '../fallback-db';

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'koalax',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

async function performDbOperation(operation: string, table: string, data: any) {
  try {
    const connection = await pool.getConnection();
    let result;

    try {
      switch (operation) {
        case 'find':
          [result] = await connection.execute(`SELECT * FROM ${table} WHERE ?`, [data.query || {}]);
          break;
        case 'findOne':
          [[result]] = await connection.execute(`SELECT * FROM ${table} WHERE ? LIMIT 1`, [data.query || {}]);
          break;
        case 'insertOne':
          [result] = await connection.execute(`INSERT INTO ${table} SET ?`, [data]);
          break;
        case 'updateOne':
          [result] = await connection.execute(`UPDATE ${table} SET ? WHERE ?`, [data.update, data.query]);
          break;
        case 'deleteOne':
          [result] = await connection.execute(`DELETE FROM ${table} WHERE ?`, [data.query]);
          break;
      }
      return result;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.warn('Falling back to local storage:', error);
    
    switch (operation) {
      case 'find':
        return fallbackDB.find(table as any, data.query);
      case 'findOne':
        return fallbackDB.findOne(table as any, data.query);
      case 'insertOne':
        return fallbackDB.insert(table as any, data);
      case 'updateOne':
        return fallbackDB.update(table as any, data.query, data.update);
      case 'deleteOne':
        return fallbackDB.delete(table as any, data.query);
      default:
        return null;
    }
  }
}

export const getMySQLClient = () => ({
  query: async (table: string, operation: string, data: any) => {
    return await performDbOperation(operation, table, data);
  }
});

export const handleMySQLError = (error: any, fallbackData: any) => {
  console.warn('MySQL Error, using fallback data:', error);
  return fallbackData;
};