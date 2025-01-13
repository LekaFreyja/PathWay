// routes/assetRoutes.js
const express = require('express');
const multer = require('multer');
const AssetController = require('../controllers/assetController');
const upload = require('../middleware/uploadMiddleware'); // Путь к файлу с настройками multer
const router = express.Router();


// Роуты
// Маршрут для загрузки нового ассета
router.post('/assets/upload', upload.single('file'), AssetController.uploadAsset);
router.get('/assets', AssetController.getAllAssets);
router.put('/assets/:id/position', AssetController.updatePosition);

module.exports = router;
