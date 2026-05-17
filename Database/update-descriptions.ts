import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

import { AbilitiesText } from 'C:/Downloads/pokemon-showdown-master/pokemon-showdown-master/data/text/abilities';
import { ItemsText } from 'C:/Downloads/pokemon-showdown-master/pokemon-showdown-master/data/text/items';
import { MovesText } from 'C:/Downloads/pokemon-showdown-master/pokemon-showdown-master/data/text/moves';
import { PokedexText } from 'C:/Downloads/pokemon-showdown-master/pokemon-showdown-master/data/text/pokedex';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  keepAlive: true,
});

async function updateDescriptions() {
  await client.connect();
  console.log('Connected to Neon');

  try {
    await client.query('BEGIN');

    for (const [id, data] of Object.entries(AbilitiesText)) {
      if (!data.desc) continue;
      await client.query(
        `UPDATE abilities SET description = $1 WHERE id = $2`,
        [data.desc, id]
      );
    }
    console.log('✓ Ability descriptions updated');

    for (const [id, data] of Object.entries(ItemsText)) {
      if (!data.desc) continue;
      await client.query(
        `UPDATE items SET description = $1 WHERE id = $2`,
        [data.desc, id]
      );
    }
    console.log('✓ Item descriptions updated');

for (const [id, data] of Object.entries(ItemsText)) {
  if (!data.shortDesc) continue;
  await client.query(
    `UPDATE items SET description = $1 WHERE id = $2`,
    [data.shortDesc, id]
  );
}
    console.log('✓ Move descriptions updated');

    for (const [id, data] of Object.entries(PokedexText)) {
      if (!data.desc) continue;
      await client.query(
        `UPDATE pokemon SET description = $1 WHERE id = $2`,
        [data.desc, id]
      );
    }
    console.log('✓ Pokemon descriptions updated');

    await client.query('COMMIT');
    console.log('✅ All descriptions updated!');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error, rolled back:', err);
  } finally {
    await client.end();
  }
}

updateDescriptions();