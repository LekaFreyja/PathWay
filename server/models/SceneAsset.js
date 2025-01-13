// models/SceneAsset.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db');

class SceneAsset extends Model {}

SceneAsset.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sceneId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    assetId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'SceneAsset',
    tableName: 'scene_assets',
    timestamps: false,
  }
);

module.exports = SceneAsset;
