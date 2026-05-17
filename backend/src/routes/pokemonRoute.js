const router = require('express').Router();
const controller = require('../controllers/pokemonController');

router.get('/', controller.searchPokemon);
router.get('/:pokemonId', controller.addPokemon);
router.patch('/team/:teamId/slot/:slotIndex', controller.updateSlot);
router.patch('/team/:teamId/slot/:slotIndex/iv', controller.updateIV);

module.exports = router;
