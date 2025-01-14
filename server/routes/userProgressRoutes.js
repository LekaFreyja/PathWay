const express = require('express');
const UserProgressController = require('../controllers/userProgressController');

const router = express.Router();

router.get('/userprogress/:userId', UserProgressController.getUserProgress);
router.post('/userprogress', UserProgressController.createUserProgress);

module.exports = router;