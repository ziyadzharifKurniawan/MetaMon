const db = require('../database/db');

const ALLOWED_SLOT_FIELDS = new Set(['pokemon_id', 'pokemonId', 'ability', 'item', 'nature']);

async function searchPokemon(search = '', page = 1) {
  return db.searchPokemonRows(search, page);
}

async function addPokemon(pokemonId) {
  return db.getPokemonDetailRow(pokemonId);
}

async function updateSlot(teamId, slotIndex, field, value) {
  const index = db.normalizeSlotIndex(slotIndex);
  if (!ALLOWED_SLOT_FIELDS.has(field)) throw new db.ApiError(400, 'field must be pokemon_id, ability, item, or nature.');
  if (typeof value === 'undefined') throw new db.ApiError(400, 'value cannot be undefined.');

  const storedField = field === 'pokemon_id' ? 'pokemonId' : field;
  if (storedField === 'pokemonId' && value) await db.findPokemonRow(value);

  db.mutateTeam(teamId, (team) => {
    team.slots[index] = { ...team.slots[index], [storedField]: value };
    if (storedField === 'pokemonId') team.slots[index].moves = ['', '', '', ''];
  });

  return { message: 'Slot updated successfully', teamId: Number(teamId), slotIndex: index, field, value };
}

async function updateIV(teamId, slotIndex, stat, value) {
  const index = db.normalizeSlotIndex(slotIndex);
  if (!db.STATS.includes(stat)) throw new db.ApiError(400, 'stat must be one of hp, atk, def, spa, spd, spe.');
  const iv = Number(value);
  if (!Number.isInteger(iv) || iv < 0 || iv > 31) throw new db.ApiError(400, 'value must be between 0 and 31.');

  db.mutateTeam(teamId, (team) => {
    team.slots[index].ivs = { ...team.slots[index].ivs, [stat]: iv };
  });

  return { message: 'IV updated successfully', teamId: Number(teamId), slotIndex: index, stat, value: iv };
}

module.exports = { searchPokemon, addPokemon, updateSlot, updateIV };
