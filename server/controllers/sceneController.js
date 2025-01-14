const { Scene, DialogueLine, Asset } = require('../models');

class SceneController {
  static async createScene(req, res) {
    try {
      const { name,
        description,
        order,
        assetId,
        branch
      } = req.body;
      const newScene = await Scene.create({
        name,
        description,
        order,
        assetId,
        branch
      });
      res.status(201).json(newScene);
    } catch (error) {
      res.status(500).json({ error: 'Error creating scene' });
    }
  }

  static async getFirstScene(req, res) {
    try {
      const firstScene = await Scene.findOne({
        order: [['order', 'ASC']],
        attributes: ['id', 'name', 'description', 'order', 'assetId', 'branch'],
        include: [
          {
            model: Asset,
            as: 'backgroundAsset',
            attributes: ['id', 'name', 'type', 'url'],
          },
          {
            model: Asset,
            as: 'characterAsset',
            attributes: ['id', 'name', 'type', 'url'],
          },
          {
            model: DialogueLine,
            as: 'dialogueLines',
            attributes: ['id', 'text', 'order', 'characterId'],
            include: [
              {
                model: Asset,
                as: 'characterAsset',
                attributes: ['id', 'name', 'type', 'url', 'position'],
              },
            ],
            order: [['order', 'ASC']],
          },
          {
            model: Asset,
            as: 'assets',
            attributes: ['id', 'name', 'type', 'url'],
          },
        ],
      });

      if (!firstScene) {
        return res.status(404).json({ error: 'Scene not found.' });
      }

      res.json(firstScene);
    } catch (error) {
      res.status(500).json({ error: 'Error loading first scene.' });
    }
  }
  static async getSceneById(req, res) {
    try {
      const scene = await Scene.findByPk(req.params.id);
      if (scene) {
        res.status(200).json(scene);
      } else {
        res.status(404).json({ message: 'Scene not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching scene', error });
    }
  };
  static async getAllScenes(req, res) {
    try {
      const scenes = await Scene.findAll({
        order: [['order', 'ASC']],
        include: [
          {
            model: Asset,
            as: 'backgroundAsset',
            attributes: ['id', 'name', 'type', 'url'],
          },
          {
            model: Asset,
            as: 'characterAsset',
            attributes: ['id', 'name', 'type', 'url'],
          },
          {
            model: DialogueLine,
            as: 'dialogueLines',
            attributes: ['id', 'text', 'order', 'characterId', 'position'],
          },
        ],
      });

      res.status(200).json(scenes);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching scenes.' });
    }
  }

  static async updateScene(req, res) {
    try {
      const { id } = req.params;
      const { name, description, order, assetId, branch } = req.body;

      const scene = await Scene.findByPk(id);
      if (!scene) {
        return res.status(404).json({ error: 'Scene not found.' });
      }

      if (name) scene.name = name;
      if (description) scene.description = description;
      if (order !== undefined) scene.order = order;
      if (branch !== undefined) scene.branch = branch;

      if (assetId) scene.assetId = assetId;

      await scene.save();
      res.status(200).json(scene);
    } catch (error) {
      res.status(500).json({ error: 'Error updating scene.' });
    }
  }
}

module.exports = SceneController;