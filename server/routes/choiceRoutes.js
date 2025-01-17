const express = require('express');
const ChoiceController = require('../controllers/choiceController');
const isAdmin = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/choices', isAdmin, ChoiceController.createChoice);
router.get('/choices', ChoiceController.getChoices);
router.post('/progress', isAdmin, ChoiceController.saveProgress);
router.get('/progress/:userId', ChoiceController.getProgress);

module.exports = router;