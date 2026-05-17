const router = require('express').Router();
const controller = require('../controllers/moveController');

router.patch('/team/:teamId/slot/:slotIndex', controller.setMove);
router.post('/team/:teamId/verify', controller.runVerification);

module.exports = router;
