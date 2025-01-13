const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db');
const DialogueLine = require('./DialogueLine');
const Asset = require('./Asset');
const SceneAsset = require('./SceneAsset');
class Scene extends Model {}

Scene.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Добавлено поле для связи с фоном (ассетом)
    assetId: {
      type: DataTypes.UUID,
      references: {
        model: 'assets', // Имя таблицы ассетов
        key: 'id', // Ключ в таблице ассетов
      },
      allowNull: true, // Может быть null, если сцена без фона
    },
  },
  {
    sequelize,
    modelName: 'Scene',
    tableName: 'scenes',
    timestamps: true,
  }
);


Scene.hasMany(SceneAsset, { foreignKey: 'sceneId' }); // Связь с SceneAsset
SceneAsset.belongsTo(Scene, { foreignKey: 'sceneId' });
module.exports = Scene;