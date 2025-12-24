import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Parse Railway MySQL URL if provided, otherwise use individual env vars
function getDbConfig() {
  // Railway provides MYSQL_URL or DATABASE_URL
  const dbUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;
  
  if (dbUrl) {
    try {
      // Parse MySQL URL format: mysql://user:password@host:port/database
      const url = new URL(dbUrl);
      return {
        host: url.hostname,
        port: parseInt(url.port || '3306'),
        user: url.username,
        password: url.password,
        database: url.pathname.slice(1), // Remove leading '/'
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      };
    } catch (error) {
      console.error('Error parsing database URL:', error);
      // Fall through to individual env vars
    }
  }
  
  // Fallback to individual environment variables
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'task_manager',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

const pool = mysql.createPool(getDbConfig());

export default pool;

