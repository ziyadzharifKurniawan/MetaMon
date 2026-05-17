const db = require('../database/db');

function setTeam(teamData) {
  const slots = teamData.slots || teamData.team || [];
  if (!Array.isArray(slots)) throw new db.ApiError(400, 'slots must be an array.');
  if (slots.length > 6) throw new db.ApiError(400, 'Team cannot contain more than 6 slots.');

  const team = db.saveTeam({ ...teamData, slots });
  return {
    message: 'Team saved successfully',
    teamId: team.teamId,
    teamName: team.teamName,
    slotCount: team.slots.length,
    team,
  };
}

module.exports = { setTeam };
