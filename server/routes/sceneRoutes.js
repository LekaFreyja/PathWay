const express = require('express');
const SceneController = require('../controllers/sceneController');
const isAdmin = require('../middleware/roleMiddleware');
const router = express.Router();

router.post('/scenes', isAdmin, SceneController.createScene);
router.get('/scenes', SceneController.getAllScenes);
router.get('/scenes/:id', SceneController.getSceneById);
router.get('/scenes/:id/:order/:branch', SceneController.getScene);
router.put('/scenes/:id', isAdmin, SceneController.updateScene);

router.get('/scenes/first', SceneController.getFirstScene);
module.exports = router;
