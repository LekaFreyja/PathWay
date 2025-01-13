// controllers/sceneController.js
const { Scene, DialogueLine, Asset } = require('../models');

class SceneController {
    // Создание новой сцены
    static async createScene(req, res) {
        try {
            const { name, description, order, assetId } = req.body; // assetId вместо assetIds

            // Создаем сцену с фоном (assetId)
            const newScene = await Scene.create({
                name,
                description,
                order,
                assetId, // Привязываем фон
            });

            res.status(201).json(newScene);
        } catch (error) {
            console.error('Ошибка при создании сцены:', error);
            res.status(500).json({ error: 'Ошибка сервера.' });
        }
    }
    static async getFirstScene(req, res) {
        try {
            const firstScene = await Scene.findOne({
                order: [['order', 'ASC']],
                attributes: ['id', 'name', 'description', 'order', 'assetId'],
                include: [
                    {
                        model: Asset,
                        as: 'backgroundAsset', // Используем 'backgroundAsset'
                        attributes: ['id', 'name', 'type', 'url'],
                    },
                    {
                        model: Asset,
                        as: 'characterAsset', // Используем 'characterAsset'
                        attributes: ['id', 'name', 'type', 'url'],
                    },
                    {
                        model: DialogueLine,
                        as: 'dialogueLines', // Диалоговые строки
                        attributes: ['id', 'text', 'order', 'characterId'],
                        include: [
                            {
                                model: Asset,
                                as: 'characterAsset', // Активы персонажей
                                attributes: ['id', 'name', 'type', 'url', 'position'],
                            },
                        ],
                        order: [['order', 'ASC']],
                    },
                    {
                        model: Asset,
                        as: 'assets', // Дополнительные активы
                        attributes: ['id', 'name', 'type', 'url'],
                    },
                ],
            });

            if (!firstScene) {
                return res.status(404).json({ error: 'Сцена не найдена.' });
            }

            res.json(firstScene);
        } catch (error) {
            console.error('Ошибка загрузки первой сцены:', error);
            res.status(500).json({ error: 'Ошибка сервера.' });
        }
    }

    static async getAllScenes(req, res) {
        try {
            const scenes = await Scene.findAll({
                order: [['order', 'ASC']],
                include: [
                    {
                        model: Asset,
                        as: 'backgroundAsset', // Привязка к фону
                        attributes: ['id', 'name', 'type', 'url'],
                    },
                    {
                        model: Asset,
                        as: 'characterAsset', // Привязка к персонажу
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
            console.error('Ошибка при получении сцен:', error);
            res.status(500).json({ error: 'Ошибка сервера.' });
        }
    }



    // Обновление сцены
    static async updateScene(req, res) {
        try {
            const { id } = req.params;
            const { name, description, order, assetId } = req.body; // assetId вместо assetIds

            const scene = await Scene.findByPk(id);
            if (!scene) {
                return res.status(404).json({ error: 'Сцена не найдена.' });
            }

            if (name) scene.name = name;
            if (description) scene.description = description;
            if (order !== undefined) scene.order = order;

            // Обновляем привязку к фону
            if (assetId) scene.assetId = assetId;

            await scene.save();
            res.status(200).json(scene);
        } catch (error) {
            console.error('Ошибка при обновлении сцены:', error);
            res.status(500).json({ error: 'Ошибка сервера.' });
        }
    }
}

module.exports = SceneController;
