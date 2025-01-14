// routes/sceneRoutes.js
const express = require('express');
const SceneController = require('../controllers/sceneController');

const router = express.Router();

router.post('/scenes', SceneController.createScene);
router.get('/scenes', SceneController.getAllScenes);
router.get('/scenes/:id', SceneController.getScene);
router.put('/scenes/:id', SceneController.updateScene);
router.get('/scenes/:id', SceneController.getSceneById);
router.get('/scenes/branch/:branch', SceneController.getScenesByBranch);
// Получение первой сцены
router.get('/scenes/first', SceneController.getFirstScene);
module.exports = router;
