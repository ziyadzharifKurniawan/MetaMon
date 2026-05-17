const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '../../..', process.env.DATA_DIR || 'database');
const TEAM_STORE = path.resolve(__dirname, '../../data/teams.json');
const STATS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

let cache;
let Pool;
let pool;

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function clean(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function loadJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, fileName), 'utf8'));
}

function groupBy(rows, key) {
  const map = new Map();
  rows.forEach((row) => {
    const id = row[key];
    if (!map.has(id)) map.set(id, []);
    map.get(id).push(row);
  });
  return map;
}

function buildIndexes() {
  if (cache) return cache;

  const pokemon = loadJson('pokemon.json');
  const forms = loadJson('pokemon_forms.json');
  const abilities = loadJson('abilities.json');
  const pokemonAbilities = loadJson('pokemon_abilities.json');
  const moves = loadJson('moves.json');
  const learnsets = loadJson('learnsets.json');
  const items = loadJson('items.json');
  const natures = loadJson('natures.json');

  const pokemonById = new Map(pokemon.map((row) => [row.id, row]));
  const pokemonByCleanName = new Map(pokemon.map((row) => [clean(row.name), row]));
  const formsById = new Map(forms.map((row) => [row.id, row]));
  const formsByPokemonId = groupBy(forms, 'pokemon_id');
  const abilitiesById = new Map(abilities.map((row) => [row.id, row]));
  const pokemonAbilitiesByFormId = groupBy(pokemonAbilities, 'pokemon_form_id');
  const movesById = new Map(moves.map((row) => [row.id, row]));
  const movesByCleanName = new Map(moves.map((row) => [clean(row.name), row]));
  const learnsetsByPokemonId = groupBy(learnsets, 'pokemon_id');
  const itemsByCleanName = new Map(items.map((row) => [clean(row.name), row]));
  const naturesById = new Map(natures.map((row) => [row.id, row]));

  cache = {
    pokemon,
    forms,
    abilities,
    pokemonAbilities,
    moves,
    learnsets,
    items,
    natures,
    pokemonById,
    pokemonByCleanName,
    formsById,
    formsByPokemonId,
    abilitiesById,
    pokemonAbilitiesByFormId,
    movesById,
    movesByCleanName,
    learnsetsByPokemonId,
    itemsByCleanName,
    naturesById,
  };
  return cache;
}

function hasPostgres() {
  return Boolean(process.env.DATABASE_URL);
}

function getPool() {
  if (!hasPostgres()) return null;
  if (!Pool) ({ Pool } = require('pg'));
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

async function query(sql, params = []) {
  const activePool = getPool();
  if (!activePool) throw new ApiError(500, 'DATABASE_URL is not configured.');
  return activePool.query(sql, params);
}

async function searchPokemonRows(search = '', page = 1) {
  if (!hasPostgres()) {
    const pageSize = 60;
    const safePage = Math.max(1, Number(page) || 1);
    const text = String(search || '').toLowerCase();
    const rows = buildIndexes().pokemon
      .filter((pokemon) => pokemon.name.toLowerCase().includes(text) || pokemon.id.includes(text))
      .sort((a, b) => a.id.localeCompare(b.id));
    return {
      pokemon: rows.slice((safePage - 1) * pageSize, safePage * pageSize).map(toPokemonSummary),
      total: rows.length,
      page: safePage,
      pages: Math.max(1, Math.ceil(rows.length / pageSize)),
    };
  }

  const safePage = Math.max(1, Number(page) || 1);
  const limit = 60;
  const offset = (safePage - 1) * limit;
  const searchPattern = `%${search || ''}%`;
  const result = await query(
    `SELECT p.id, p.name, p.tier, p.doubles_tier, p.natdex_tier, p.is_nonstandard,
            pf.type1, pf.type2, pf.hp, pf.atk, pf.def, pf.spa, pf.spd, pf.spe,
            pf.height, pf.weight, pf.is_mega
     FROM pokemon p
     LEFT JOIN pokemon_forms pf ON pf.id = p.id
     WHERE p.name ILIKE $1 OR p.id ILIKE $1
     ORDER BY p.id
     LIMIT $2 OFFSET $3`,
    [searchPattern, limit, offset]
  );
  const count = await query('SELECT COUNT(*) FROM pokemon WHERE name ILIKE $1 OR id ILIKE $1', [searchPattern]);
  const total = Number(count.rows[0].count);
  return { pokemon: result.rows, total, page: safePage, pages: Math.max(1, Math.ceil(total / limit)) };
}

async function getPokemonDetailRow(id) {
  if (!hasPostgres()) return getPokemonDetail(id);

  const pokemon = await query(
    `SELECT p.*, pf.type1, pf.type2, pf.hp, pf.atk, pf.def, pf.spa, pf.spd, pf.spe,
            pf.height, pf.weight, pf.gender, pf.catch_rate, pf.base_exp,
            pf.egg_cycles, pf.friendship, pf.growth_rate, pf.is_mega,
            pf.ev_hp, pf.ev_atk, pf.ev_def, pf.ev_spa, pf.ev_spd, pf.ev_spe
     FROM pokemon p
     LEFT JOIN pokemon_forms pf ON pf.id = p.id
     WHERE p.id = $1`,
    [String(id || '').toLowerCase()]
  );
  if (!pokemon.rows.length) throw new ApiError(404, `Pokemon "${id}" was not found.`);

  const abilities = await query(
    `SELECT a.id, a.name, a.description, pa.slot, pa.is_hidden
     FROM pokemon_abilities pa
     JOIN abilities a ON a.id = pa.ability_id
     WHERE pa.pokemon_form_id = $1
     ORDER BY pa.slot`,
    [String(id || '').toLowerCase()]
  );
  const learnset = await query(
    `SELECT DISTINCT ON (m.id)
            m.id, m.name, m.type, m.category, m.power, m.accuracy, m.pp,
            m.priority, m.description, l.method, l.level, l.game_id
     FROM learnsets l
     JOIN moves m ON m.id = l.move_id
     WHERE l.pokemon_id = $1
     ORDER BY m.id, l.method, l.level`,
    [String(id || '').toLowerCase()]
  );
  const forms = await query(
    `SELECT pf.id, pf.form_name, pf.type1, pf.type2,
            pf.hp, pf.atk, pf.def, pf.spa, pf.spd, pf.spe, pf.is_mega
     FROM pokemon_forms pf
     WHERE pf.pokemon_id = $1`,
    [String(id || '').toLowerCase()]
  );

  return {
    ...pokemon.rows[0],
    abilities: abilities.rows,
    learnset: learnset.rows.sort((a, b) => a.name.localeCompare(b.name)),
    forms: forms.rows,
  };
}

async function findPokemonRow(id) {
  if (!hasPostgres()) return findPokemon(id);
  const result = await query('SELECT * FROM pokemon WHERE id = $1', [String(id || '').toLowerCase()]);
  if (!result.rows.length) throw new ApiError(404, `Pokemon "${id}" was not found.`);
  return result.rows[0];
}

async function findMoveRow(idOrName) {
  if (!hasPostgres()) return findMove(idOrName);
  const result = await query(
    `SELECT *
     FROM moves
     WHERE id = $1 OR LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '', 'g')) = $2
     LIMIT 1`,
    [String(idOrName || '').toLowerCase(), clean(idOrName)]
  );
  return result.rows[0] || null;
}

async function pokemonCanLearnMove(pokemonId, moveId) {
  if (!hasPostgres()) {
    return new Set((buildIndexes().learnsetsByPokemonId.get(pokemonId) || []).map((row) => row.move_id)).has(moveId);
  }
  const result = await query(
    'SELECT 1 FROM learnsets WHERE pokemon_id = $1 AND move_id = $2 LIMIT 1',
    [pokemonId, moveId]
  );
  return Boolean(result.rows.length);
}

async function getItemByName(name) {
  if (!hasPostgres()) return buildIndexes().itemsByCleanName.get(clean(name)) || null;
  const result = await query(
    `SELECT *
     FROM items
     WHERE LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '', 'g')) = $1
     LIMIT 1`,
    [clean(name)]
  );
  return result.rows[0] || null;
}

async function listItems(search = '') {
  if (!hasPostgres()) {
    const text = String(search || '').toLowerCase();
    return buildIndexes().items
      .filter((item) => item.name.toLowerCase().includes(text))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 50);
  }
  const result = await query('SELECT * FROM items WHERE name ILIKE $1 ORDER BY name LIMIT 50', [`%${search || ''}%`]);
  return result.rows;
}

async function listNatures() {
  if (!hasPostgres()) return [...buildIndexes().natures].sort((a, b) => a.name.localeCompare(b.name));
  const result = await query('SELECT * FROM natures ORDER BY name');
  return result.rows;
}

function getPrimaryForm(pokemonId) {
  const db = buildIndexes();
  const forms = db.formsByPokemonId.get(pokemonId) || [];
  return db.formsById.get(pokemonId) || forms.find((form) => form.hp !== null) || forms[0] || {};
}

function findPokemon(idOrName) {
  const db = buildIndexes();
  const key = String(idOrName || '').toLowerCase();
  const pokemon = db.pokemonById.get(key) || db.pokemonByCleanName.get(clean(key));
  if (!pokemon) throw new ApiError(404, `Pokemon "${idOrName}" was not found.`);
  return pokemon;
}

function findMove(idOrName) {
  const db = buildIndexes();
  const key = String(idOrName || '').toLowerCase();
  return db.movesById.get(key) || db.movesByCleanName.get(clean(key));
}

function toPokemonSummary(pokemon) {
  const form = getPrimaryForm(pokemon.id);
  return {
    id: pokemon.id,
    name: pokemon.name,
    tier: pokemon.tier,
    doubles_tier: pokemon.doubles_tier,
    natdex_tier: pokemon.natdex_tier,
    is_nonstandard: pokemon.is_nonstandard,
    type1: form.type1 || null,
    type2: form.type2 || null,
    hp: form.hp,
    atk: form.atk,
    def: form.def,
    spa: form.spa,
    spd: form.spd,
    spe: form.spe,
    height: form.height,
    weight: form.weight,
    is_mega: form.is_mega,
  };
}

function getPokemonDetail(idOrName) {
  const db = buildIndexes();
  const pokemon = findPokemon(idOrName);
  const form = getPrimaryForm(pokemon.id);
  const formIds = new Set([pokemon.id, form.id, ...(db.formsByPokemonId.get(pokemon.id) || []).map((row) => row.id)]);
  const abilities = [...formIds].flatMap((formId) => db.pokemonAbilitiesByFormId.get(formId) || [])
    .map((link) => ({ ...db.abilitiesById.get(link.ability_id), slot: link.slot, is_hidden: link.is_hidden }))
    .filter((row, index, rows) => row.id && rows.findIndex((item) => item.id === row.id) === index)
    .sort((a, b) => (a.slot || 0) - (b.slot || 0));

  const moveRows = db.learnsetsByPokemonId.get(pokemon.id) || [];
  const seenMoves = new Set();
  const learnset = moveRows
    .map((row) => ({ link: row, move: db.movesById.get(row.move_id) }))
    .filter(({ move }) => move && !seenMoves.has(move.id) && seenMoves.add(move.id))
    .map(({ link, move }) => ({
      id: move.id,
      name: move.name,
      type: move.type,
      category: move.category,
      power: move.power,
      accuracy: move.accuracy,
      pp: move.pp,
      priority: move.priority,
      description: move.description,
      method: link.method,
      level: link.level,
      game_id: link.game_id,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    ...pokemon,
    ...toPokemonSummary(pokemon),
    abilities,
    learnset,
    forms: db.formsByPokemonId.get(pokemon.id) || [],
  };
}

function emptySlot(slotIndex) {
  return {
    slotIndex,
    pokemonId: null,
    ability: '',
    item: '',
    nature: '',
    moves: ['', '', '', ''],
    ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
  };
}

function readTeamStore() {
  if (!fs.existsSync(TEAM_STORE)) {
    fs.mkdirSync(path.dirname(TEAM_STORE), { recursive: true });
    fs.writeFileSync(TEAM_STORE, JSON.stringify({ nextTeamId: 1, teams: {} }, null, 2));
  }
  return JSON.parse(fs.readFileSync(TEAM_STORE, 'utf8'));
}

function writeTeamStore(store) {
  fs.writeFileSync(TEAM_STORE, JSON.stringify(store, null, 2));
}

function normalizeSlotIndex(slotIndex) {
  const index = Number(slotIndex);
  if (!Number.isInteger(index) || index < 0 || index > 5) {
    throw new ApiError(400, 'slotIndex must be between 0 and 5.');
  }
  return index;
}

function normalizeTeamId(teamId) {
  const id = Number(teamId);
  if (!Number.isInteger(id) || id < 1) throw new ApiError(400, 'teamId must be a positive integer.');
  return id;
}

function ensureTeam(teamId) {
  const store = readTeamStore();
  const id = normalizeTeamId(teamId);
  if (!store.teams[id]) {
    store.teams[id] = {
      teamId: id,
      teamName: `Team ${id}`,
      slots: Array.from({ length: 6 }, (_, index) => emptySlot(index)),
    };
    if (store.nextTeamId <= id) store.nextTeamId = id + 1;
    writeTeamStore(store);
  }
  return store.teams[id];
}

function saveTeam(team) {
  const store = readTeamStore();
  const id = team.teamId ? normalizeTeamId(team.teamId) : store.nextTeamId++;
  const slots = Array.from({ length: 6 }, (_, index) => emptySlot(index));
  (team.slots || []).slice(0, 6).forEach((slot, index) => {
    const slotIndex = Number.isInteger(slot.slotIndex) ? normalizeSlotIndex(slot.slotIndex) : index;
    const pokemonId = slot.pokemonId || slot.pokemon_id || slot.pokemon?.id || null;
    slots[slotIndex] = {
      ...emptySlot(slotIndex),
      pokemonId,
      ability: slot.ability || '',
      item: slot.item || '',
      nature: slot.nature || '',
      moves: Array.from({ length: 4 }, (_, moveIndex) => (slot.moves || [])[moveIndex] || ''),
      ivs: { ...emptySlot(slotIndex).ivs, ...(slot.ivs || {}) },
    };
  });
  store.teams[id] = { teamId: id, teamName: team.teamName || `Team ${id}`, slots };
  writeTeamStore(store);
  return store.teams[id];
}

function mutateTeam(teamId, mutator) {
  const store = readTeamStore();
  const id = normalizeTeamId(teamId);
  const team = store.teams[id];
  if (!team) throw new ApiError(404, `Team ${id} does not exist.`);
  mutator(team);
  writeTeamStore(store);
  return team;
}

module.exports = {
  ApiError,
  STATS,
  clean,
  hasPostgres,
  query,
  buildIndexes,
  searchPokemonRows,
  getPokemonDetailRow,
  findPokemonRow,
  findMoveRow,
  pokemonCanLearnMove,
  getItemByName,
  listItems,
  listNatures,
  findPokemon,
  findMove,
  getPrimaryForm,
  getPokemonDetail,
  toPokemonSummary,
  emptySlot,
  ensureTeam,
  saveTeam,
  mutateTeam,
  normalizeSlotIndex,
};
