const express = require('express');
const multer = require('multer');
const AssetController = require('../controllers/assetController');
const upload = require('../middleware/uploadMiddleware');
const isAdmin = require('../middleware/roleMiddleware');
const router = express.Router();


router.post('/assets/upload', upload.single('file'), isAdmin, AssetController.uploadAsset);
router.get('/assets', AssetController.getAllAssets);
router.put('/assets/:id/position', isAdmin, AssetController.updatePosition);

module.exports = router;
