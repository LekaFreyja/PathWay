const { UserProgress, Scene } = require('../models');

class UserProgressController {
  static async getUserProgress(req, res) {
    try {
      const { userId } = req.params;
      const userProgress = await UserProgress.findOne({ where: { userId } });
      if (userProgress) {
        res.status(200).json(userProgress);
      } else {
        res.status(404).json({ message: 'User progress not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user progress', error });
    }
  }

  static async createUserProgress(req, res) {
    try {
      const { userId, currentSceneId, branch } = req.body;
      const newUserProgress = await UserProgress.create({
        userId,
        currentSceneId,
        branch,
      });
      res.status(201).json(newUserProgress);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user progress', error });
    }
  }
}

module.exports = UserProgressController;