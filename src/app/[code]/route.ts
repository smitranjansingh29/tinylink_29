import { NextRequest, NextResponse } from 'next/server';
import { sql } from '../../../lib/db';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params; // ← AWAIT the params

    const result = await sql`
      SELECT target_url FROM links WHERE code = ${code}
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    // Update click stats
    await sql`
      UPDATE links 
      SET clicks = clicks + 1, last_clicked_at = CURRENT_TIMESTAMP 
      WHERE code = ${code}
    `;

    return NextResponse.redirect(result[0].target_url);
  } catch (error) {
    console.error('Error redirecting:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
