import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

import { FormatsData } from 'C:/Downloads/pokemon-showdown-master/pokemon-showdown-master/data/formats-data';
import { Pokedex } from 'C:/Downloads/pokemon-showdown-master/pokemon-showdown-master/data/pokedex';

const client = new Client({ connectionString: process.env.DATABASE_URL, keepAlive: true });

async function updateFormats() {
  await client.connect();
  console.log('Connected to Neon');

  try {
    await client.query('BEGIN');

    for (const [id, data] of Object.entries(FormatsData)) {
      await client.query(
        `UPDATE pokemon SET
          tier = $1,
          doubles_tier = $2,
          natdex_tier = $3,
          is_nonstandard = $4
         WHERE id = $5`,
        [
          data.tier ?? null,
          data.doublesTier ?? null,
          data.natDexTier ?? null,
          data.isNonstandard ?? null,
          id
        ]
      );
    }
    console.log('✓ Pokemon tiers and nonstandard updated');

    for (const [id, data] of Object.entries(Pokedex)) {
      await client.query(
        `UPDATE pokemon_forms SET
          catch_rate = $1,
          base_exp = $2,
          egg_cycles = $3,
          friendship = $4
         WHERE id = $5`,
        [
          data.catchRate ?? null,
          data.baseExp ?? null,
          data.eggCycles ?? null,
          data.happiness ?? null,
          id
        ]
      );
    }
    console.log('✓ Pokemon forms stats updated');

    await client.query('COMMIT');
    console.log('✅ All done!');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error, rolled back:', err);
  } finally {
    await client.end();
  }
}

updateFormats();