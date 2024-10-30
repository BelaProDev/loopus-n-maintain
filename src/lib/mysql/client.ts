import mysql from 'mysql2/promise';
import { withAsyncHandler } from '../asyncUtils';

const STORAGE_PREFIX = 'koalax_';

// Fallback implementation using localStorage when database is unavailable
const localStorageDB = {
  getItem: (table: string) => {
    try {
      const data = localStorage.getItem(`${STORAGE_PREFIX}${table}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  setItem: (table: string, data: any[]) => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${table}`, JSON.stringify(data));
    } catch (error) {
      console.error('Local storage error:', error);
    }
  }
};

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
          [result] = await connection.query(`SELECT * FROM ${table} WHERE ?`, data.query || {});
          break;
        case 'findOne':
          [[result]] = await connection.query(`SELECT * FROM ${table} WHERE ? LIMIT 1`, data.query || {});
          break;
        case 'insertOne':
          [result] = await connection.query(`INSERT INTO ${table} SET ?`, data);
          break;
        case 'updateOne':
          [result] = await connection.query(`UPDATE ${table} SET ? WHERE ?`, [data.update, data.query]);
          break;
        case 'deleteOne':
          [result] = await connection.query(`DELETE FROM ${table} WHERE ?`, data.query);
          break;
      }
      return result;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.warn('Falling back to local storage:', error);
    const storedData = localStorageDB.getItem(table);
    
    switch (operation) {
      case 'find':
        return storedData;
      case 'findOne':
        return storedData.find((item: any) => 
          Object.entries(data.query || {}).every(([key, value]) => item[key] === value)
        );
      case 'insertOne': {
        const newItem = { ...data, id: crypto.randomUUID() };
        localStorageDB.setItem(table, [...storedData, newItem]);
        return { insertId: newItem.id };
      }
      case 'updateOne': {
        const updatedData = storedData.map((item: any) => {
          if (Object.entries(data.query).every(([key, value]) => item[key] === value)) {
            return { ...item, ...data.update };
          }
          return item;
        });
        localStorageDB.setItem(table, updatedData);
        return { affectedRows: 1 };
      }
      case 'deleteOne': {
        const filteredData = storedData.filter((item: any) => 
          !Object.entries(data.query).every(([key, value]) => item[key] === value)
        );
        localStorageDB.setItem(table, filteredData);
        return { affectedRows: storedData.length - filteredData.length };
      }
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