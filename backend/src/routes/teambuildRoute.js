const router = require('express').Router();
const controller = require('../controllers/teambuildController');

router.post('/set-team', controller.setTeam);

module.exports = router;
