// models/DialogueLine.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db');
const Asset = require('./Asset'); // Для связи с персонажами
const Scene = require('./Scene'); // Модель сцены

class DialogueLine extends Model {}

DialogueLine.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    characterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Asset, // Указываем модель Asset для персонажей
        key: 'id',
      },
    },
    sceneId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Scene, // Указываем модель Scene
        key: 'id',
      },
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    position: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: { x: 0, y: 0 },
    },
  },
  {
    sequelize,
    modelName: 'DialogueLine',
    tableName: 'dialogue_lines',
    timestamps: true,
  }
);
DialogueLine.belongsTo(Asset, { as: 'characterAsset', foreignKey: 'characterId' });
module.exports = DialogueLine;
