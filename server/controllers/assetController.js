//const { Asset } = require('../models');
//const { v4: uuidv4 } = require('uuid');
//
//class AssetController {
//  // Загрузка нового ассета
//  static async uploadAsset(req, res) {
//    try {
//      const { type, name, position } = req.body;
//      const file = req.file;
//
//      if (!file) {
//        return res.status(400).json({ error: 'Файл обязателен для загрузки.' });
//      }
//
//      // Создание нового ассета
//      const newAsset = await Asset.create({
//        id: uuidv4(),
//        type,
//        name,
//        url: `/uploads/${file.filename}`, // Путь к файлу
//        position,
//      });
//
//      res.status(201).json(newAsset);
//    } catch (error) {
//      console.error('Ошибка при загрузке ассета:', error);
//      res.status(500).json({ error: 'Ошибка сервера.' });
//    }
//  }
//
//  // Получение всех ассетов
//  static async getAllAssets(req, res) {
//    try {
//      const assets = await Asset.findAll();
//      res.status(200).json(assets);
//    } catch (error) {
//      console.error('Ошибка при получении ассетов:', error);
//      res.status(500).json({ error: 'Ошибка сервера.' });
//    }
//  }
//
//  // Обновление позиции ассета
//  static async updatePosition(req, res) {
//    try {
//      const { id } = req.params;
//      const { position } = req.body;
//
//      const asset = await Asset.findByPk(id);
//      if (!asset) {
//        return res.status(404).json({ error: 'Ассет не найден.' });
//      }
//
//      asset.position = position;
//      await asset.save();
//
//      res.status(200).json(asset);
//    } catch (error) {
//      console.error('Ошибка при обновлении позиции:', error);
//      res.status(500).json({ error: 'Ошибка сервера.' });
//    }
//  }
//}
//
//module.exports = AssetController;
const { Asset } = require('../models');
const { v4: uuidv4 } = require('uuid');

class AssetController {
  // Загрузка нового ассета
  static async uploadAsset(req, res) {
    try {
      const { type, name, position } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'Файл обязателен для загрузки.' });
      }

      // Валидация позиции
      const validPositions = ['left', 'left-center', 'center', 'right-center', 'right'];
      if (!validPositions.includes(position)) {
        return res.status(400).json({ error: 'Некорректная позиция.' });
      }

      // Создание нового ассета
      const newAsset = await Asset.create({
        id: uuidv4(),
        type,
        name,
        url: `/uploads/${file.filename}`, // Путь к файлу
        position,
      });

      res.status(201).json(newAsset);
    } catch (error) {
      console.error('Ошибка при загрузке ассета:', error);
      res.status(500).json({ error: 'Ошибка сервера.' });
    }
  }

  // Получение всех ассетов
  static async getAllAssets(req, res) {
    try {
      const assets = await Asset.findAll();
      res.status(200).json(assets);
    } catch (error) {
      console.error('Ошибка при получении ассетов:', error);
      res.status(500).json({ error: 'Ошибка сервера.' });
    }
  }

  // Обновление позиции ассета
  static async updatePosition(req, res) {
    try {
      const { id } = req.params;
      const { position } = req.body;

      // Валидация позиции
      const validPositions = ['left', 'left-center', 'center', 'right-center', 'right'];
      if (!validPositions.includes(position)) {
        return res.status(400).json({ error: 'Некорректная позиция.' });
      }

      const asset = await Asset.findByPk(id);
      if (!asset) {
        return res.status(404).json({ error: 'Ассет не найден.' });
      }

      asset.position = position;
      await asset.save();

      res.status(200).json(asset);
    } catch (error) {
      console.error('Ошибка при обновлении позиции:', error);
      res.status(500).json({ error: 'Ошибка сервера.' });
    }
  }
}

module.exports = AssetController;
