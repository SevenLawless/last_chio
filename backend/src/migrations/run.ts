import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Get migrations directory (this file is in src/migrations/)
const migrationsDir = __dirname;

// Get database configuration
function getDbConfig() {
  const dbUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;
  
  if (dbUrl) {
    try {
      const url = new URL(dbUrl);
      return {
        host: url.hostname,
        port: parseInt(url.port || '3306'),
        user: url.username,
        password: url.password,
        database: url.pathname.slice(1),
      };
    } catch (error) {
      console.error('Error parsing database URL:', error);
    }
  }
  
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'task_manager',
  };
}

async function runMigrations() {
  const config = getDbConfig();
  const connection = await mysql.createConnection(config);
  
  try {
    console.log('Starting database migrations...');
    
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    if (files.length === 0) {
      console.log('No migration files found.');
      return;
    }
    
    for (const file of files) {
      console.log(`Running migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Split by semicolons and execute each statement
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      for (const statement of statements) {
        await connection.execute(statement);
      }
      
      console.log(`✓ Completed: ${file}`);
    }
    
    console.log('All migrations completed successfully.');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigrations();

