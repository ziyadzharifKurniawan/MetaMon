const db = require('../database/db');

async function setMove(teamId, slotIndex, moveIndex, moveName) {
  const index = db.normalizeSlotIndex(slotIndex);
  const moveSlot = Number(moveIndex);
  if (!Number.isInteger(moveSlot) || moveSlot < 0 || moveSlot > 3) {
    throw new db.ApiError(400, 'moveIndex must be between 0 and 3.');
  }

  const move = await db.findMoveRow(moveName);
  if (!move) throw new db.ApiError(404, `Move "${moveName}" was not found.`);

  let pokemonId;
  const team = db.mutateTeam(teamId, (draft) => {
    const slot = draft.slots[index];
    if (!slot.pokemonId) throw new db.ApiError(400, 'Select a Pokemon before setting moves.');
    pokemonId = slot.pokemonId;
    slot.moves[moveSlot] = move.name;
  });

  if (!(await db.pokemonCanLearnMove(pokemonId, move.id))) {
    db.mutateTeam(teamId, (draft) => {
      draft.slots[index].moves[moveSlot] = '';
    });
    throw new db.ApiError(400, `${move.name} is not in ${pokemonId}'s learnset.`);
  }

  return {
    message: 'Move set successfully',
    teamId: team.teamId,
    slotIndex: index,
    moveIndex: moveSlot,
    moveName: move.name,
  };
}

async function runVerification(teamId) {
  const team = db.ensureTeam(teamId);
  const errors = [];
  const filledSlots = team.slots.filter((slot) => slot.pokemonId);

  if (filledSlots.length > 6) errors.push('Team cannot contain more than 6 Pokemon.');

  for (const slot of filledSlots) {
    let pokemon;
    try {
      pokemon = await db.findPokemonRow(slot.pokemonId);
    } catch {
      errors.push(`Slot ${slot.slotIndex + 1} contains an invalid Pokemon.`);
      continue;
    }

    if (pokemon.is_nonstandard || pokemon.tier === 'Illegal') {
      errors.push(`${pokemon.name} is Illegal under current rules.`);
    }

    if (slot.item) {
      const item = await db.getItemByName(slot.item);
      if (!item || item.is_nonstandard || item.is_nonstandard === 'Past') {
        errors.push(`The item "${slot.item}" chosen for ${pokemon.name} is Illegal.`);
      }
    }

    const activeMoves = slot.moves.filter(Boolean);
    const moveCounts = new Map();
    activeMoves.forEach((moveName) => {
      const key = db.clean(moveName);
      moveCounts.set(key, (moveCounts.get(key) || 0) + 1);
    });
    moveCounts.forEach((count, key) => {
      if (count > 1) errors.push(`${pokemon.name} has duplicate configurations for the move: ${activeMoves.find((move) => db.clean(move) === key)}`);
    });

    for (const moveName of activeMoves) {
      const move = await db.findMoveRow(moveName);
      if (!move) {
        errors.push(`${moveName} does not exist in the moves table.`);
      } else if (!(await db.pokemonCanLearnMove(pokemon.id, move.id))) {
        errors.push(`${pokemon.name} cannot learn ${move.name}.`);
      }
    }

    Object.entries(slot.ivs || {}).forEach(([stat, value]) => {
      if (!db.STATS.includes(stat) || value < 0 || value > 31) {
        errors.push(`${pokemon.name} has an invalid ${stat} IV.`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { setMove, runVerification };
