import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';

  const result = await pool.query(
    `SELECT * FROM items WHERE name ILIKE $1 ORDER BY name LIMIT 50`,
    [`%${search}%`]
  );
  return NextResponse.json(result.rows);
}