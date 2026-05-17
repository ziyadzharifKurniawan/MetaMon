import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 60;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT p.id, p.name, p.tier, p.doubles_tier, p.natdex_tier, p.is_nonstandard,
              pf.type1, pf.type2, pf.hp, pf.atk, pf.def, pf.spa, pf.spd, pf.spe,
              pf.height, pf.weight, pf.is_mega
       FROM pokemon p
       LEFT JOIN pokemon_forms pf ON pf.id = p.id
       WHERE p.name ILIKE $1
       ORDER BY p.id
       LIMIT $2 OFFSET $3`,
      [`%${search}%`, limit, offset]
    );

    const count = await pool.query(
      `SELECT COUNT(*) FROM pokemon WHERE name ILIKE $1`,
      [`%${search}%`]
    );

    return NextResponse.json({
      pokemon: result.rows,
      total: parseInt(count.rows[0].count),
      page,
      pages: Math.ceil(parseInt(count.rows[0].count) / limit),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}