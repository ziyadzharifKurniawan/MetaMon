import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const type = searchParams.get('type') || '';
  const category = searchParams.get('category') || '';

  let query = `SELECT * FROM moves WHERE name ILIKE $1`;
  const values = [`%${search}%`];

  if (type) {
    values.push(type);
    query += ` AND type = $${values.length}`;
  }
  if (category) {
    values.push(category);
    query += ` AND category = $${values.length}`;
  }

  query += ` ORDER BY name LIMIT 50`;

  const result = await pool.query(query, values);
  return NextResponse.json(result.rows);
}