import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db';

export async function GET() {
  const types = await pool.query(`SELECT * FROM types ORDER BY gen, name`);
  const chart = await pool.query(`SELECT * FROM type_chart`);
  return NextResponse.json({ types: types.rows, chart: chart.rows });
}