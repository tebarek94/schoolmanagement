import { DatabaseConfig } from '@/types';
import mysql from 'mysql2/promise';

const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management',
  connectionLimit: 10,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Execute query with error handling
export const executeQuery = async <T = any>(
  query: string,
  params: any[] = []
): Promise<T> => {
  try {
    const [rows] = await pool.execute(query, params);
    return rows as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Execute transaction
export const executeTransaction = async <T = any>(
  queries: Array<{ query: string; params?: any[] }>
): Promise<T[]> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const results: T[] = [];
    for (const { query, params = [] } of queries) {
      const [result] = await connection.execute(query, params);
      results.push(result as T);
    }
    
    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Get connection from pool
export const getConnection = () => pool.getConnection();

export default pool;
