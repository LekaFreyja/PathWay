const { Choice, UserProgress } = require('../models');

class ChoiceController {
  static async createChoice(req, res) {
    try {
      const { sceneId, text, nextSceneId } = req.body;
      const newChoice = await Choice.create({ sceneId, text, nextSceneId });
      res.status(201).json(newChoice);
    } catch (error) {
        console.error('Error adding choice:', error);
        res.status(500).json({ error: 'Ошибка при добавлении выбора' });
    }
  }

  static async getChoices(req, res) {
    try {
      const choices = await Choice.findAll();
      res.status(200).json(choices);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching choices' });
    }
  }

  static async saveProgress(req, res) {
    try {
      const { userId, currentSceneId, branch, choices } = req.body;
      const progress = await UserProgress.create({ userId, currentSceneId, branch, choices });
      res.status(201).json(progress);
    } catch (error) {
      res.status(500).json({ error: 'Error saving progress' });
    }
  }

  static async getProgress(req, res) {
    try {
      const { userId } = req.params;
      const progress = await UserProgress.findOne({ where: { userId } });
      res.status(200).json(progress);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching progress' });
    }
  }
}

module.exports = ChoiceController;