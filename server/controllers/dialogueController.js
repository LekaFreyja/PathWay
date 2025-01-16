// controllers/dialogueController.js
const { DialogueLine, Asset, Scene } = require('../models');

class DialogueController {
  // Добавление новой реплики
  static async createDialogueLine(req, res) {
    try {
      const { text, characterId, sceneId, order, position } = req.body;

      // Проверяем существование персонажа
      const character = await Asset.findByPk(characterId);
      if (!character || character.type !== 'character') {
        return res.status(404).json({ error: 'Персонаж не найден.' });
      }

      // Проверяем существование сцены
      const scene = await Scene.findByPk(sceneId);
      if (!scene) {
        return res.status(404).json({ error: 'Сцена не найдена.' });
      }

      const newDialogueLine = await DialogueLine.create({
        text,
        characterId,
        sceneId,
        order,
        position,
      });

      res.status(201).json(newDialogueLine);
    } catch (error) {
      console.error('Ошибка при создании реплики:', error);
      res.status(500).json({ error: 'Ошибка сервера.' });
    }
  }
  static async getDialogueById(req, res) {
    try {
      const { id } = req.params;

      const dialogue = await DialogueLine.findOne({
        where: { id }
      });

      if (!dialogue) {
        return res.status(404).json({ error: 'Диалог не найден.' });
      }

      res.status(200).json(dialogue);
    } catch (error) {
      console.error('Ошибка при получении данных о диалоге:', error);
      res.status(500).json({ error: 'Ошибка сервера.' });
    }
  }

  // Получение всех реплик в сцене
  static async getDialogueLinesByScene(req, res) {
    try {
      const { sceneId } = req.params;

      const dialogueLines = await DialogueLine.findAll({
        where: { sceneId },
        order: [['order', 'ASC']], // Сортировка по порядку
      });

      res.status(200).json(dialogueLines);
    } catch (error) {
      console.error('Ошибка при получении реплик:', error);
      res.status(500).json({ error: 'Ошибка сервера.' });
    }
  }

  // Обновление реплики
  static async updateDialogueLine(req, res) {
    try {
      const { id } = req.params;
      const { text, position, order } = req.body;

      const dialogueLine = await DialogueLine.findByPk(id);
      if (!dialogueLine) {
        return res.status(404).json({ error: 'Реплика не найдена.' });
      }

      if (text) dialogueLine.text = text;
      if (position) dialogueLine.position = position;
      if (order !== undefined) dialogueLine.order = order;

      await dialogueLine.save();
      res.status(200).json(dialogueLine);
    } catch (error) {
      console.error('Ошибка при обновлении реплики:', error);
      res.status(500).json({ error: 'Ошибка сервера.' });
    }
  }
}

module.exports = DialogueController;
