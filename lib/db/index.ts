import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);

export async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS links (
        id SERIAL PRIMARY KEY,
        code VARCHAR(8) UNIQUE NOT NULL,
        target_url TEXT NOT NULL,
        clicks INTEGER DEFAULT 0,
        last_clicked_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Database initialized');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}