// routes/dialogueRoutes.js
const express = require('express');
const DialogueController = require('../controllers/dialogueController');

const router = express.Router();

router.post('/dialogues', DialogueController.createDialogueLine);
router.get('/dialogues/scene/:sceneId', DialogueController.getDialogueLinesByScene); // Новый маршрут
router.put('/dialogues/:id', DialogueController.updateDialogueLine);

module.exports = router;
