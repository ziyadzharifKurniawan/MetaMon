import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

import { MovesText } from 'C:/Downloads/pokemon-showdown-master/pokemon-showdown-master/data/text/moves';

const client = new Client({ connectionString: process.env.DATABASE_URL, keepAlive: true });

async function seedConditions() {
  await client.connect();
  console.log('Connected to Neon');

  try {
    await client.query('BEGIN');

    // MOVE CONDITIONS - parsed from descriptions
    const conditionPatterns: { regex: RegExp; condition: string }[] = [
      { regex: /(\d+)% chance to burn/i, condition: 'brn' },
      { regex: /always burn/i, condition: 'brn' },
      { regex: /(\d+)% chance to freeze/i, condition: 'frz' },
      { regex: /always freeze/i, condition: 'frz' },
      { regex: /(\d+)% chance to paralyze/i, condition: 'par' },
      { regex: /always paralyze/i, condition: 'par' },
      { regex: /(\d+)% chance to badly poison/i, condition: 'tox' },
      { regex: /(\d+)% chance to poison/i, condition: 'psn' },
      { regex: /always poison/i, condition: 'psn' },
      { regex: /(\d+)% chance.*?flinch/i, condition: 'flinch' },
      { regex: /(\d+)% chance.*?confus/i, condition: 'confusion' },
      { regex: /(\d+)% chance.*?fall asleep/i, condition: 'slp' },
      { regex: /(\d+)% chance.*?sleep/i, condition: 'slp' },
      { regex: /puts.*?to sleep/i, condition: 'slp' },
      { regex: /causes.*?to fall asleep/i, condition: 'slp' },
    ];

    const weatherMoves: { id: string; condition: string }[] = [
      { id: 'sunnyday', condition: 'sunnyday' },
      { id: 'raindance', condition: 'raindance' },
      { id: 'sandstorm', condition: 'sandstorm' },
      { id: 'hail', condition: 'hail' },
      { id: 'snowscape', condition: 'snowscape' },
    ];

    const terrainMoves: { id: string; condition: string }[] = [
      { id: 'electricterrain', condition: 'electricterrain' },
      { id: 'grassyterrain', condition: 'grassyterrain' },
      { id: 'mistyterrain', condition: 'mistyterrain' },
      { id: 'psychicterrain', condition: 'psychicterrain' },
    ];

    for (const [id, data] of Object.entries(MovesText)) {
      const desc = data.desc ?? data.shortDesc;
      if (!desc) continue;

      for (const { regex, condition } of conditionPatterns) {
        const match = desc.match(regex);
        if (match) {
          const chance = match[1] ? parseInt(match[1]) : 100;
          await client.query(
            `INSERT INTO move_conditions (move_id, condition_id, chance, target)
             VALUES ($1, $2, $3, $4) ON CONFLICT (move_id, condition_id) DO NOTHING`,
            [id, condition, chance, 'opponent']
          );
        }
      }
    }

    for (const { id, condition } of [...weatherMoves, ...terrainMoves]) {
      await client.query(
        `INSERT INTO move_conditions (move_id, condition_id, chance, target)
         VALUES ($1, $2, $3, $4) ON CONFLICT (move_id, condition_id) DO NOTHING`,
        [id, condition, 100, 'field']
      );
    }
    console.log('✓ Move conditions seeded');

    // ITEM CONDITIONS
   const itemConditions: { item: string; condition: string; interaction: string }[] = [
  { item: 'flameorb', condition: 'brn', interaction: 'causes' },
  { item: 'toxicorb', condition: 'tox', interaction: 'causes' },
  { item: 'lightball', condition: 'par', interaction: 'causes' },
  { item: 'cheriberry', condition: 'par', interaction: 'cures' },
  { item: 'pechaberry', condition: 'psn', interaction: 'cures' },
  { item: 'rawstberry', condition: 'brn', interaction: 'cures' },
  { item: 'aspearberry', condition: 'frz', interaction: 'cures' },
  { item: 'chestoberry', condition: 'slp', interaction: 'cures' },
  { item: 'lumberry', condition: 'brn', interaction: 'cures' },
  { item: 'lumberry', condition: 'frz', interaction: 'cures' },
  { item: 'lumberry', condition: 'par', interaction: 'cures' },
  { item: 'lumberry', condition: 'psn', interaction: 'cures' },
  { item: 'lumberry', condition: 'tox', interaction: 'cures' },
  { item: 'lumberry', condition: 'slp', interaction: 'cures' },
  { item: 'lumberry', condition: 'confusion', interaction: 'cures' },
  { item: 'persimberry', condition: 'confusion', interaction: 'cures' },
  { item: 'mentalherb', condition: 'confusion', interaction: 'cures' },
  { item: 'iceberry', condition: 'brn', interaction: 'cures' },
];

    for (const { item, condition, interaction } of itemConditions) {
      await client.query(
        `INSERT INTO item_conditions (item_id, condition_id, interaction)
         VALUES ($1, $2, $3) ON CONFLICT (item_id, condition_id) DO NOTHING`,
        [item, condition, interaction]
      );
    }
    console.log('✓ Item conditions seeded');

    // ABILITY CONDITIONS
    const abilityConditions: { ability: string; condition: string; interaction: string }[] = [
      { ability: 'flamebody', condition: 'brn', interaction: 'causes' },
      { ability: 'static', condition: 'par', interaction: 'causes' },
      { ability: 'poisonpoint', condition: 'psn', interaction: 'causes' },
      { ability: 'effectspore', condition: 'psn', interaction: 'causes' },
      { ability: 'effectspore', condition: 'par', interaction: 'causes' },
      { ability: 'effectspore', condition: 'slp', interaction: 'causes' },
      { ability: 'cursedbody', condition: 'par', interaction: 'causes' },
      { ability: 'synchronize', condition: 'brn', interaction: 'copies' },
      { ability: 'synchronize', condition: 'par', interaction: 'copies' },
      { ability: 'synchronize', condition: 'psn', interaction: 'copies' },
      { ability: 'synchronize', condition: 'tox', interaction: 'copies' },
      { ability: 'naturalcure', condition: 'brn', interaction: 'cures' },
      { ability: 'naturalcure', condition: 'frz', interaction: 'cures' },
      { ability: 'naturalcure', condition: 'par', interaction: 'cures' },
      { ability: 'naturalcure', condition: 'psn', interaction: 'cures' },
      { ability: 'naturalcure', condition: 'tox', interaction: 'cures' },
      { ability: 'naturalcure', condition: 'slp', interaction: 'cures' },
      { ability: 'shedskin', condition: 'brn', interaction: 'cures' },
      { ability: 'shedskin', condition: 'frz', interaction: 'cures' },
      { ability: 'shedskin', condition: 'par', interaction: 'cures' },
      { ability: 'shedskin', condition: 'psn', interaction: 'cures' },
      { ability: 'shedskin', condition: 'tox', interaction: 'cures' },
      { ability: 'shedskin', condition: 'slp', interaction: 'cures' },
      { ability: 'hydration', condition: 'brn', interaction: 'cures' },
      { ability: 'hydration', condition: 'frz', interaction: 'cures' },
      { ability: 'hydration', condition: 'par', interaction: 'cures' },
      { ability: 'hydration', condition: 'psn', interaction: 'cures' },
      { ability: 'hydration', condition: 'tox', interaction: 'cures' },
      { ability: 'hydration', condition: 'slp', interaction: 'cures' },
      { ability: 'immunity', condition: 'psn', interaction: 'immune' },
      { ability: 'immunity', condition: 'tox', interaction: 'immune' },
      { ability: 'insomnia', condition: 'slp', interaction: 'immune' },
      { ability: 'vitalspirit', condition: 'slp', interaction: 'immune' },
      { ability: 'limber', condition: 'par', interaction: 'immune' },
      { ability: 'magmaarmor', condition: 'frz', interaction: 'immune' },
      { ability: 'waterveil', condition: 'brn', interaction: 'immune' },
      { ability: 'thermalexchange', condition: 'brn', interaction: 'immune' },
      { ability: 'leafguard', condition: 'brn', interaction: 'immune' },
      { ability: 'leafguard', condition: 'frz', interaction: 'immune' },
      { ability: 'leafguard', condition: 'par', interaction: 'immune' },
      { ability: 'leafguard', condition: 'psn', interaction: 'immune' },
      { ability: 'leafguard', condition: 'tox', interaction: 'immune' },
      { ability: 'leafguard', condition: 'slp', interaction: 'immune' },
      { ability: 'sweetveil', condition: 'slp', interaction: 'immune' },
      { ability: 'pastelveil', condition: 'psn', interaction: 'immune' },
      { ability: 'pastelveil', condition: 'tox', interaction: 'immune' },
      { ability: 'purifyingsalt', condition: 'brn', interaction: 'immune' },
      { ability: 'purifyingsalt', condition: 'frz', interaction: 'immune' },
      { ability: 'purifyingsalt', condition: 'par', interaction: 'immune' },
      { ability: 'purifyingsalt', condition: 'psn', interaction: 'immune' },
      { ability: 'purifyingsalt', condition: 'tox', interaction: 'immune' },
      { ability: 'purifyingsalt', condition: 'slp', interaction: 'immune' },
      { ability: 'dryskin', condition: 'brn', interaction: 'causes' },
      { ability: 'healer', condition: 'brn', interaction: 'cures' },
      { ability: 'healer', condition: 'frz', interaction: 'cures' },
      { ability: 'healer', condition: 'par', interaction: 'cures' },
      { ability: 'healer', condition: 'psn', interaction: 'cures' },
      { ability: 'healer', condition: 'tox', interaction: 'cures' },
      { ability: 'healer', condition: 'slp', interaction: 'cures' },
      { ability: 'poisonheal', condition: 'psn', interaction: 'immune' },
      { ability: 'poisonheal', condition: 'tox', interaction: 'immune' },
      { ability: 'earlybird', condition: 'slp', interaction: 'cures' },
      { ability: 'electricsurge', condition: 'electricterrain', interaction: 'causes' },
      { ability: 'grassysurge', condition: 'grassyterrain', interaction: 'causes' },
      { ability: 'mistysurge', condition: 'mistyterrain', interaction: 'causes' },
      { ability: 'psychicsurge', condition: 'psychicterrain', interaction: 'causes' },
      { ability: 'drought', condition: 'sunnyday', interaction: 'causes' },
      { ability: 'drizzle', condition: 'raindance', interaction: 'causes' },
      { ability: 'sandstream', condition: 'sandstorm', interaction: 'causes' },
      { ability: 'snowwarning', condition: 'hail', interaction: 'causes' },
      { ability: 'desolateland', condition: 'sunnyday', interaction: 'causes' },
      { ability: 'primordialsea', condition: 'raindance', interaction: 'causes' },
      { ability: 'deltastream', condition: 'sandstorm', interaction: 'causes' },
    ];

    for (const { ability, condition, interaction } of abilityConditions) {
      await client.query(
        `INSERT INTO ability_conditions (ability_id, condition_id, interaction)
         VALUES ($1, $2, $3) ON CONFLICT (ability_id, condition_id) DO NOTHING`,
        [ability, condition, interaction]
      );
    }
    console.log('✓ Ability conditions seeded');

    await client.query('COMMIT');
    console.log('✅ All conditions seeded!');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error, rolled back:', err);
  } finally {
    await client.end();
  }
}

seedConditions();