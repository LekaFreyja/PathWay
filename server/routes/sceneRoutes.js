// routes/sceneRoutes.js
const express = require('express');
const SceneController = require('../controllers/sceneController');

const router = express.Router();

router.post('/scenes', SceneController.createScene);
router.get('/scenes', SceneController.getAllScenes);
router.get('/scenes/:id', SceneController.getSceneById);
router.get('/scenes/:id/:order/:branch', SceneController.getScene);
router.put('/scenes/:id', SceneController.updateScene);
// Получение первой сцены
router.get('/scenes/first', SceneController.getFirstScene);
module.exports = router;
