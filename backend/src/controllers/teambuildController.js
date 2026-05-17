const model = require('../models/teambuild.model');

async function setTeam(req, res) {
  try {
    res.json(model.setTeam(req.body || {}));
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

module.exports = { setTeam };
