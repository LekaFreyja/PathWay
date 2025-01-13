const sequelize = require('./db'); // Импорт sequelize напрямую
const User = require('./User');
const Asset = require('./Asset');
const DialogueLine = require('./DialogueLine');
const Scene = require('./Scene');
const SceneAsset = require('./SceneAsset');

// Ассоциации
// Связь с диалогами
Scene.hasMany(DialogueLine, { foreignKey: 'sceneId', as: 'dialogueLines' });
DialogueLine.belongsTo(Scene, { foreignKey: 'sceneId', as: 'scene' });
Scene.belongsTo(Asset, { as: 'backgroundAsset', foreignKey: 'assetId' });
Scene.belongsTo(Asset, { as: 'characterAsset', foreignKey: 'characterAssetId' });

// Дополнительные активы через промежуточную таблицу SceneAssets
Scene.belongsToMany(Asset, {
  through: SceneAsset,
  as: 'assets', // Для дополнительных активов
  foreignKey: 'sceneId',
  otherKey: 'assetId',
});

Asset.belongsToMany(Scene, {
  through: SceneAsset,
  as: 'scenes', // Если активы связываются с несколькими сценами
  foreignKey: 'assetId',
  otherKey: 'sceneId',
});

sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced without clearing data!');
});

module.exports = { sequelize, User, Asset, DialogueLine, Scene, SceneAsset };
