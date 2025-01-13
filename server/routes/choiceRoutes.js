const express = require('express');
const ChoiceController = require('../controllers/choiceController');

const router = express.Router();

router.post('/choices', ChoiceController.createChoice);
router.get('/choices', ChoiceController.getChoices);
router.post('/progress', ChoiceController.saveProgress);
router.get('/progress/:userId', ChoiceController.getProgress);

module.exports = router;