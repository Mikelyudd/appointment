import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

interface PostgresError extends Error {
  code?: string;
}

async function initDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'your_password'
  });

  try {
    await client.connect();
    console.log('Connected to postgres database');

    // 创建用户（如果不存在）
    try {
      await client.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'postgres') THEN
            CREATE ROLE postgres WITH LOGIN PASSWORD '${process.env.DB_PASSWORD || 'your_password'}' CREATEDB;
          END IF;
        END
        $$;
      `);
      console.log('User postgres created or already exists');
    } catch (err) {
      console.log('Error creating user:', err);
    }

    // 创建数据库（如果不存在）
    try {
      await client.query('CREATE DATABASE booking_db;');
      console.log('Database booking_db created');
    } catch (err) {
      const pgError = err as PostgresError;
      if (pgError.code === '42P04') {
        console.log('Database booking_db already exists');
      } else {
        console.log('Error creating database:', err);
      }
    }

    // 授权
    try {
      await client.query(`
        GRANT ALL PRIVILEGES ON DATABASE booking_db TO postgres;
      `);
      console.log('Privileges granted to postgres user');
    } catch (err) {
      console.log('Error granting privileges:', err);
    }

    console.log('Database initialization completed');
  } catch (err) {
    console.error('Error during database initialization:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('Database initialization script completed');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Database initialization failed:', err);
      process.exit(1);
    });
}

export default initDatabase; 