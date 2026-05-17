import { NextResponse } from 'next/server';
import { pool } from '../../../../lib/db';

export async function GET(request, { params }) {
  const { id } = await params;

  const pokemon = await pool.query(
    `SELECT p.*, pf.type1, pf.type2, pf.hp, pf.atk, pf.def, pf.spa, pf.spd, pf.spe,
            pf.height, pf.weight, pf.gender, pf.catch_rate, pf.base_exp,
            pf.egg_cycles, pf.friendship, pf.growth_rate, pf.is_mega,
            pf.ev_hp, pf.ev_atk, pf.ev_def, pf.ev_spa, pf.ev_spd, pf.ev_spe
     FROM pokemon p
     LEFT JOIN pokemon_forms pf ON pf.id = p.id
     WHERE p.id = $1`,
    [id]
  );

  if (!pokemon.rows.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const abilities = await pool.query(
    `SELECT a.id, a.name, a.description, pa.slot, pa.is_hidden
     FROM pokemon_abilities pa
     JOIN abilities a ON a.id = pa.ability_id
     WHERE pa.pokemon_form_id = $1
     ORDER BY pa.slot`,
    [id]
  );

  const learnset = await pool.query(
    `SELECT m.id, m.name, m.type, m.category, m.power, m.accuracy, m.pp,
            m.priority, m.description, l.method, l.level, l.game_id
     FROM learnsets l
     JOIN moves m ON m.id = l.move_id
     WHERE l.pokemon_id = $1
     ORDER BY l.method, l.level`,
    [id]
  );

  const eggGroups = await pool.query(
    `SELECT eg.id, eg.name
     FROM pokemon_egg_groups peg
     JOIN egg_groups eg ON eg.id = peg.egg_group_id
     WHERE peg.pokemon_id = $1`,
    [id]
  );

  const forms = await pool.query(
    `SELECT pf.id, pf.form_name, pf.type1, pf.type2,
            pf.hp, pf.atk, pf.def, pf.spa, pf.spd, pf.spe, pf.is_mega
     FROM pokemon_forms pf
     WHERE pf.pokemon_id = $1`,
    [id]
  );

  return NextResponse.json({
    ...pokemon.rows[0],
    abilities: abilities.rows,
    learnset: learnset.rows,
    eggGroups: eggGroups.rows,
    forms: forms.rows,
  });
}