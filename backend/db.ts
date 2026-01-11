import { Pool } from 'pg';

// Configure PostgreSQL Connection Pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'shijra_db',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
  max: 20, // Max clients in the pool
  idleTimeoutMillis: 30000,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
