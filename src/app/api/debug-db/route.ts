import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  console.log('Testing database connection...');
  
  try {
    // Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set');
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL environment variable is missing',
        details: 'Please set DATABASE_URL in Vercel environment variables'
      }, { status: 500 });
    }

    console.log('DATABASE_URL found, testing connection...');
    
    const sql = neon(process.env.DATABASE_URL);
    
    // Test simple query
    const result = await sql`SELECT 1 as connection_test`;
    console.log('Database test result:', result);

    // Test if links table exists and has data
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'links'
      ) as table_exists
    `;
    
    console.log('Table exists:', tableCheck[0]?.table_exists);

    if (tableCheck[0]?.table_exists) {
      const rowCount = await sql`SELECT COUNT(*) as count FROM links`;
      console.log('Rows in links table:', rowCount[0]?.count);
    }

    return NextResponse.json({
      success: true,
      database: 'connected',
      table_exists: tableCheck[0]?.table_exists,
      row_count: tableCheck[0]?.table_exists ? rowCount[0]?.count : 0,
      connection_test: result[0]
    });

  } catch (error: any) {
    console.error('Database connection failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error.message,
      database_url_prefix: process.env.DATABASE_URL ? 
        process.env.DATABASE_URL.substring(0, 20) + '...' : 'not set'
    }, { status: 500 });
  }
}
