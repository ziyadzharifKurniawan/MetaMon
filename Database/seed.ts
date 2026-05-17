import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

import { Natures } from 'C:/Downloads/pokemon-showdown-master/pokemon-showdown-master/data/natures';
import { TypeChart } from 'C:/Downloads/pokemon-showdown-master/pokemon-showdown-master/data/typechart';
import { Pokedex } from 'C:/Downloads/pokemon-showdown-master/pokemon-showdown-master/data/pokedex';
import { Moves } from 'C:/Downloads/pokemon-showdown-master/pokemon-showdown-master/data/moves';
import { Abilities } from 'C:/Downloads/pokemon-showdown-master/pokemon-showdown-master/data/abilities';
import { Items } from 'C:/Downloads/pokemon-showdown-master/pokemon-showdown-master/data/items';
import { Learnsets } from 'C:/Downloads/pokemon-showdown-master/pokemon-showdown-master/data/learnsets';
import { Abilities as ModAbilities } from 'C:/Downloads/pokemon-showdown-master/pokemon-showdown-master/data/mods/champions/abilities';
import { Moves as ModMoves } from 'C:/Downloads/pokemon-showdown-master/pokemon-showdown-master/data/mods/champions/moves';
import { Items as ModItems } from 'C:/Downloads/pokemon-showdown-master/pokemon-showdown-master/data/mods/champions/items';
import { Pokedex as ModPokedex } from 'C:/Downloads/pokemon-showdown-master/pokemon-showdown-master/data/mods/champions/pokedex';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  keepAlive: true,
  connectionTimeoutMillis: 30000,
  query_timeout: 30000,
});

async function seed() {
  await client.connect();
  console.log('Connected to Neon');

  try {
    await client.query('BEGIN');

    const validTypes = [
      'normal','fire','water','electric','grass','ice','fighting',
      'poison','ground','flying','psychic','bug','rock','ghost',
      'dragon','dark','steel','fairy','stellar'
    ];

    const releases = [
      { id: 'red-blue', name: 'Red/Blue', gen: 1 },
      { id: 'yellow', name: 'Yellow', gen: 1 },
      { id: 'gold-silver', name: 'Gold/Silver', gen: 2 },
      { id: 'crystal', name: 'Crystal', gen: 2 },
      { id: 'ruby-sapphire', name: 'Ruby/Sapphire', gen: 3 },
      { id: 'firered-leafgreen', name: 'FireRed/LeafGreen', gen: 3 },
      { id: 'emerald', name: 'Emerald', gen: 3 },
      { id: 'diamond-pearl', name: 'Diamond/Pearl', gen: 4 },
      { id: 'platinum', name: 'Platinum', gen: 4 },
      { id: 'heartgold-soulsilver', name: 'HeartGold/SoulSilver', gen: 4 },
      { id: 'black-white', name: 'Black/White', gen: 5 },
      { id: 'black-white-2', name: 'Black 2/White 2', gen: 5 },
      { id: 'x-y', name: 'X/Y', gen: 6 },
      { id: 'omega-ruby-alpha-sapphire', name: 'Omega Ruby/Alpha Sapphire', gen: 6 },
      { id: 'sun-moon', name: 'Sun/Moon', gen: 7 },
      { id: 'ultra-sun-ultra-moon', name: 'Ultra Sun/Ultra Moon', gen: 7 },
      { id: 'lets-go-pikachu-eevee', name: "Let's Go Pikachu/Eevee", gen: 7 },
      { id: 'sword-shield', name: 'Sword/Shield', gen: 8 },
      { id: 'brilliant-diamond-shining-pearl', name: 'Brilliant Diamond/Shining Pearl', gen: 8 },
      { id: 'legends-arceus', name: 'Legends: Arceus', gen: 8 },
      { id: 'scarlet-violet', name: 'Scarlet/Violet', gen: 9 },
      { id: 'legends-z-a', name: 'Legends: Z-A', gen: 9 },
    ];

    for (const r of releases) {
      await client.query(
        `INSERT INTO releases (id, name, gen) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
        [r.id, r.name, r.gen]
      );
    }
    console.log('✓ Releases seeded');

    const games = [
      { id: 'red', name: 'Red', release_id: 'red-blue' },
      { id: 'blue', name: 'Blue', release_id: 'red-blue' },
      { id: 'yellow', name: 'Yellow', release_id: 'yellow' },
      { id: 'gold', name: 'Gold', release_id: 'gold-silver' },
      { id: 'silver', name: 'Silver', release_id: 'gold-silver' },
      { id: 'crystal', name: 'Crystal', release_id: 'crystal' },
      { id: 'ruby', name: 'Ruby', release_id: 'ruby-sapphire' },
      { id: 'sapphire', name: 'Sapphire', release_id: 'ruby-sapphire' },
      { id: 'firered', name: 'FireRed', release_id: 'firered-leafgreen' },
      { id: 'leafgreen', name: 'LeafGreen', release_id: 'firered-leafgreen' },
      { id: 'emerald', name: 'Emerald', release_id: 'emerald' },
      { id: 'diamond', name: 'Diamond', release_id: 'diamond-pearl' },
      { id: 'pearl', name: 'Pearl', release_id: 'diamond-pearl' },
      { id: 'platinum', name: 'Platinum', release_id: 'platinum' },
      { id: 'heartgold', name: 'HeartGold', release_id: 'heartgold-soulsilver' },
      { id: 'soulsilver', name: 'SoulSilver', release_id: 'heartgold-soulsilver' },
      { id: 'black', name: 'Black', release_id: 'black-white' },
      { id: 'white', name: 'White', release_id: 'black-white' },
      { id: 'black-2', name: 'Black 2', release_id: 'black-white-2' },
      { id: 'white-2', name: 'White 2', release_id: 'black-white-2' },
      { id: 'x', name: 'X', release_id: 'x-y' },
      { id: 'y', name: 'Y', release_id: 'x-y' },
      { id: 'omega-ruby', name: 'Omega Ruby', release_id: 'omega-ruby-alpha-sapphire' },
      { id: 'alpha-sapphire', name: 'Alpha Sapphire', release_id: 'omega-ruby-alpha-sapphire' },
      { id: 'sun', name: 'Sun', release_id: 'sun-moon' },
      { id: 'moon', name: 'Moon', release_id: 'sun-moon' },
      { id: 'ultra-sun', name: 'Ultra Sun', release_id: 'ultra-sun-ultra-moon' },
      { id: 'ultra-moon', name: 'Ultra Moon', release_id: 'ultra-sun-ultra-moon' },
      { id: 'lets-go-pikachu', name: "Let's Go Pikachu", release_id: 'lets-go-pikachu-eevee' },
      { id: 'lets-go-eevee', name: "Let's Go Eevee", release_id: 'lets-go-pikachu-eevee' },
      { id: 'sword', name: 'Sword', release_id: 'sword-shield' },
      { id: 'shield', name: 'Shield', release_id: 'sword-shield' },
      { id: 'brilliant-diamond', name: 'Brilliant Diamond', release_id: 'brilliant-diamond-shining-pearl' },
      { id: 'shining-pearl', name: 'Shining Pearl', release_id: 'brilliant-diamond-shining-pearl' },
      { id: 'legends-arceus', name: 'Legends: Arceus', release_id: 'legends-arceus' },
      { id: 'scarlet', name: 'Scarlet', release_id: 'scarlet-violet' },
      { id: 'violet', name: 'Violet', release_id: 'scarlet-violet' },
      { id: 'legends-z-a', name: 'Legends: Z-A', release_id: 'legends-z-a' },
    ];

    for (const g of games) {
      await client.query(
        `INSERT INTO games (id, name, release_id) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
        [g.id, g.name, g.release_id]
      );
    }
    console.log('✓ Games seeded');

    const types = [
      { id: 'normal', name: 'Normal', gen: 1 },
      { id: 'fire', name: 'Fire', gen: 1 },
      { id: 'water', name: 'Water', gen: 1 },
      { id: 'electric', name: 'Electric', gen: 1 },
      { id: 'grass', name: 'Grass', gen: 1 },
      { id: 'ice', name: 'Ice', gen: 1 },
      { id: 'fighting', name: 'Fighting', gen: 1 },
      { id: 'poison', name: 'Poison', gen: 1 },
      { id: 'ground', name: 'Ground', gen: 1 },
      { id: 'flying', name: 'Flying', gen: 1 },
      { id: 'psychic', name: 'Psychic', gen: 1 },
      { id: 'bug', name: 'Bug', gen: 1 },
      { id: 'rock', name: 'Rock', gen: 1 },
      { id: 'ghost', name: 'Ghost', gen: 1 },
      { id: 'dragon', name: 'Dragon', gen: 1 },
      { id: 'dark', name: 'Dark', gen: 2 },
      { id: 'steel', name: 'Steel', gen: 2 },
      { id: 'fairy', name: 'Fairy', gen: 6 },
      { id: 'stellar', name: 'Stellar', gen: 9 },
    ];

    for (const t of types) {
      await client.query(
        `INSERT INTO types (id, name, gen) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
        [t.id, t.name, t.gen]
      );
    }
    console.log('✓ Types seeded');

    for (const [defendingType, data] of Object.entries(TypeChart)) {
      for (const [key, value] of Object.entries(data.damageTaken)) {
        const attackingType = key.toLowerCase();
        if (!validTypes.includes(attackingType)) continue;
        await client.query(
          `INSERT INTO type_chart (attacking_type, defending_type, effectiveness)
           VALUES ($1, $2, $3) ON CONFLICT (attacking_type, defending_type) DO NOTHING`,
          [attackingType, defendingType, value]
        );
      }
    }
    console.log('✓ Type chart seeded');

    const eggGroups = [
      'amorphous', 'bug', 'ditto', 'dragon', 'fairy',
      'field', 'flying', 'grass', 'human-like', 'mineral',
      'monster', 'undiscovered', 'water-1', 'water-2', 'water-3'
    ];

    for (const eg of eggGroups) {
      await client.query(
        `INSERT INTO egg_groups (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
        [eg, eg.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())]
      );
    }
    console.log('✓ Egg groups seeded');

    for (const [id, data] of Object.entries(Natures)) {
      await client.query(
        `INSERT INTO natures (id, name, plus_stat, minus_stat)
         VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING`,
        [id, data.name, data.plus ?? null, data.minus ?? null]
      );
    }
    console.log('✓ Natures seeded');

    const conditions = [
      { id: 'brn', name: 'Burn', type: 'status' },
      { id: 'frz', name: 'Freeze', type: 'status' },
      { id: 'par', name: 'Paralysis', type: 'status' },
      { id: 'psn', name: 'Poison', type: 'status' },
      { id: 'tox', name: 'Toxic', type: 'status' },
      { id: 'slp', name: 'Sleep', type: 'status' },
      { id: 'confusion', name: 'Confusion', type: 'volatile' },
      { id: 'flinch', name: 'Flinch', type: 'volatile' },
      { id: 'sandstorm', name: 'Sandstorm', type: 'weather' },
      { id: 'sunnyday', name: 'Sun', type: 'weather' },
      { id: 'raindance', name: 'Rain', type: 'weather' },
      { id: 'hail', name: 'Hail', type: 'weather' },
      { id: 'snowscape', name: 'Snow', type: 'weather' },
      { id: 'electricterrain', name: 'Electric Terrain', type: 'terrain' },
      { id: 'grassyterrain', name: 'Grassy Terrain', type: 'terrain' },
      { id: 'mistyterrain', name: 'Misty Terrain', type: 'terrain' },
      { id: 'psychicterrain', name: 'Psychic Terrain', type: 'terrain' },
    ];

    for (const c of conditions) {
      await client.query(
        `INSERT INTO conditions (id, name, type) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
        [c.id, c.name, c.type]
      );
    }
    console.log('✓ Conditions seeded');

    for (const [id, data] of Object.entries(Abilities)) {
      if (data.inherit) continue;
      await client.query(
        `INSERT INTO abilities (id, name, gen, short_desc, description, is_nonstandard)
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
        [id, data.name, data.gen ?? 1, data.shortDesc ?? null, data.desc ?? null, data.isNonstandard ?? null]
      );
    }
    console.log('✓ Abilities seeded');

    for (const [id, data] of Object.entries(Items)) {
      await client.query(
        `INSERT INTO items (id, name, category, gen, cost, short_desc, description, is_nonstandard)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING`,
        [
          id, data.name, data.category ?? null,
          data.gen ?? 1, data.cost ?? 0,
          data.shortDesc ?? null, data.desc ?? null,
          data.isNonstandard ?? null
        ]
      );
    }
    console.log('✓ Items seeded');

    for (const [id, data] of Object.entries(Moves)) {
      const flags = data.flags ?? {};
      await client.query(
        `INSERT INTO moves (
          id, name, type, category, power, accuracy, pp, priority, target, gen,
          flag_contact, flag_sound, flag_punch, flag_bite, flag_bullet,
          flag_pulse, flag_powder, flag_protect, flag_reflectable, flag_mirror,
          flag_snatch, flag_bypasssub, flag_defrost,
          is_z, is_max, short_desc, description, is_nonstandard
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
          $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
          $21,$22,$23,$24,$25,$26,$27,$28
        ) ON CONFLICT (id) DO NOTHING`,
        [
          id, data.name, data.type?.toLowerCase() ?? null,
          data.category ?? null, data.basePower ?? null,
          data.accuracy === true ? null : data.accuracy ?? null,
          data.pp ?? null, data.priority ?? 0,
          data.target ?? null, data.gen ?? 1,
          !!flags.contact, !!flags.sound, !!flags.punch, !!flags.bite,
          !!flags.bullet, !!flags.pulse, !!flags.powder, !!flags.protect,
          !!flags.reflectable, !!flags.mirror, !!flags.snatch,
          !!flags.bypasssub, !!flags.defrost,
          data.isZ ?? null, data.isMax ?? null,
          data.shortDesc ?? null, data.desc ?? null,
          data.isNonstandard ?? null
        ]
      );
    }
    console.log('✓ Moves seeded');

    for (const [id, data] of Object.entries(Pokedex)) {
      await client.query(
        `INSERT INTO pokemon (id, name, gen, tier, doubles_tier, natdex_tier, is_nonstandard)
         VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
        [
          id, data.name, data.gen ?? 1,
          data.tier ?? null, data.doublesTier ?? null,
          data.natDexTier ?? null, data.isNonstandard ?? null
        ]
      );

      const baseSpeciesId = data.baseSpecies
        ? data.baseSpecies.toLowerCase().replace(/[^a-z0-9]/g, '') : id;

      await client.query(
        `INSERT INTO pokemon_forms (
          id, pokemon_id, form_name, type1, type2,
          hp, atk, def, spa, spd, spe,
          height, weight, gender, catch_rate,
          base_exp, egg_cycles, friendship, growth_rate,
          ev_hp, ev_atk, ev_def, ev_spa, ev_spd, ev_spe,
          is_mega, gen
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
          $11,$12,$13,$14,$15,$16,$17,$18,$19,
          $20,$21,$22,$23,$24,$25,$26,$27
        ) ON CONFLICT (id) DO NOTHING`,
        [
          id, baseSpeciesId, data.forme ?? null,
          validTypes.includes(data.types?.[0]?.toLowerCase()) ? data.types?.[0]?.toLowerCase() : null,
          validTypes.includes(data.types?.[1]?.toLowerCase()) ? data.types?.[1]?.toLowerCase() : null,
          data.baseStats?.hp ?? null, data.baseStats?.atk ?? null,
          data.baseStats?.def ?? null, data.baseStats?.spa ?? null,
          data.baseStats?.spd ?? null, data.baseStats?.spe ?? null,
          data.heightm ?? null, data.weightkg ?? null,
          data.gender ?? null, data.catchRate ?? null,
          data.baseExp ?? null, data.eggCycles ?? null,
          data.happiness ?? null, data.growthRate ?? null,
          data.evYield?.hp ?? 0, data.evYield?.atk ?? 0,
          data.evYield?.def ?? 0, data.evYield?.spa ?? 0,
          data.evYield?.spd ?? 0, data.evYield?.spe ?? 0,
          !!data.isMega, data.gen ?? 1
        ]
      );

      if (data.abilities) {
        const abilitySlots = [
          { key: '0', slot: 1, hidden: false },
          { key: '1', slot: 2, hidden: false },
          { key: 'H', slot: 3, hidden: true },
        ];
        for (const { key, slot, hidden } of abilitySlots) {
          const abilityName = data.abilities[key];
          if (!abilityName) continue;
          const abilityId = abilityName.toLowerCase().replace(/[^a-z0-9]/g, '');
          await client.query(
            `INSERT INTO pokemon_abilities (pokemon_form_id, ability_id, slot, is_hidden)
             VALUES ($1, $2, $3, $4) ON CONFLICT (pokemon_form_id, slot) DO NOTHING`,
            [id, abilityId, slot, hidden]
          );
        }
      }

      if (data.eggGroups) {
        for (const eg of data.eggGroups) {
          const egId = eg.toLowerCase().replace(/\s/g, '-');
          await client.query(
            `INSERT INTO pokemon_egg_groups (pokemon_id, egg_group_id)
             VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [baseSpeciesId, egId]
          );
        }
      }
    }
    console.log('✓ Pokemon, forms, abilities, egg groups seeded');

    const validMoveIds = new Set(
      (await client.query(`SELECT id FROM moves`)).rows.map((r: any) => r.id)
    );
    const validPokemonIds = new Set(
      (await client.query(`SELECT id FROM pokemon`)).rows.map((r: any) => r.id)
    );

    const methodMap: Record<string, string> = {
      L: 'level-up', M: 'tm', E: 'egg', T: 'tutor', S: 'event', D: 'dream-world'
    };

    const learnsetValues: any[] = [];

    for (const [pokemonId, data] of Object.entries(Learnsets)) {
      if (!validPokemonIds.has(pokemonId)) continue;
      const learnset = data.learnset;
      if (!learnset) continue;
      for (const [moveId, methods] of Object.entries(learnset)) {
        if (!validMoveIds.has(moveId)) continue;
        for (const method of methods) {
          const gen = method[0];
          const type = method[1];
          const level = type === 'L' ? parseInt(method.slice(2)) : null;
          learnsetValues.push([pokemonId, moveId, `gen${gen}`, methodMap[type] ?? type, level]);
        }
      }
    }

    for (let i = 0; i < learnsetValues.length; i += 500) {
      const batch = learnsetValues.slice(i, i + 500);
      const placeholders = batch.map((_, j) =>
        `($${j * 5 + 1},$${j * 5 + 2},$${j * 5 + 3},$${j * 5 + 4},$${j * 5 + 5})`
      ).join(',');
      await client.query(
        `INSERT INTO learnsets (pokemon_id, move_id, game_id, method, level) VALUES ${placeholders}`,
        batch.flat()
      );
    }
    console.log('✓ Learnsets seeded');

    await client.query('COMMIT');
    console.log('✅ All done!');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error, rolled back:', err);
  } finally {
    await client.end();
  }
}

seed();