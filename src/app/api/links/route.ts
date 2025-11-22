import { NextRequest, NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const { targetUrl, customCode } = await request.json();

    // Validate URL
    try {
      new URL(targetUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL' },
        { status: 400 }
      );
    }

    // Validate custom code format
    const code = customCode || generateRandomCode();
    if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
      return NextResponse.json(
        { error: 'Code must be 6-8 alphanumeric characters' },
        { status: 400 }
      );
    }

    // Check if code exists
    const existing = await sql`
      SELECT code FROM links WHERE code = ${code}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Code already exists' },
        { status: 409 }
      );
    }

    // Insert new link
    const result = await sql`
      INSERT INTO links (code, target_url) 
      VALUES (${code}, ${targetUrl})
      RETURNING code, target_url, clicks, last_clicked_at, created_at
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const links = await sql`
      SELECT code, target_url, clicks, last_clicked_at, created_at 
      FROM links 
      ORDER BY created_at DESC
    `;
    return NextResponse.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateRandomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}