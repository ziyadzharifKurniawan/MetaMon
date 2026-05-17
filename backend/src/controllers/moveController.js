const model = require('../models/move.model');

async function setMove(req, res) {
  try {
    const { moveIndex, moveName } = req.body;
    res.json(await model.setMove(req.params.teamId, req.params.slotIndex, moveIndex, moveName));
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function runVerification(req, res) {
  try {
    res.json(await model.runVerification(req.params.teamId));
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

module.exports = { setMove, runVerification };
