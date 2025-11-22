import { NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';

export async function GET() {
  try {
    // Test database connection
    await sql`SELECT 1`;
    
    return NextResponse.json({
      ok: true,
      version: "1.0",
      timestamp: new Date().toISOString(),
      database: "connected"
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      version: "1.0",
      timestamp: new Date().toISOString(),
      database: "disconnected"
    }, { status: 500 });
  }
}