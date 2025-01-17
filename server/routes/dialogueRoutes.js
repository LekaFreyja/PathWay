const express = require('express');
const DialogueController = require('../controllers/dialogueController');
const isAdmin = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/dialogues', isAdmin, DialogueController.createDialogueLine);
router.get('/dialogues/scene/:sceneId', DialogueController.getDialogueLinesByScene);
router.put('/dialogues/:id', isAdmin, DialogueController.updateDialogueLine);
router.get('/dialogues/:id', DialogueController.getDialogueById)

module.exports = router;
