const model = require('../models/pokemon.model');

function sendError(res, error) {
  res.status(error.status || 500).json({ error: error.message });
}

async function searchPokemon(req, res) {
  try {
    res.json(await model.searchPokemon(req.query.search, req.query.page));
  } catch (error) {
    sendError(res, error);
  }
}

async function addPokemon(req, res) {
  try {
    res.json(await model.addPokemon(req.params.pokemonId));
  } catch (error) {
    sendError(res, error);
  }
}

async function updateSlot(req, res) {
  try {
    const { field, value } = req.body;
    res.json(await model.updateSlot(req.params.teamId, req.params.slotIndex, field, value));
  } catch (error) {
    sendError(res, error);
  }
}

async function updateIV(req, res) {
  try {
    const { stat, value } = req.body;
    res.json(await model.updateIV(req.params.teamId, req.params.slotIndex, stat, value));
  } catch (error) {
    sendError(res, error);
  }
}

module.exports = { searchPokemon, addPokemon, updateSlot, updateIV };
