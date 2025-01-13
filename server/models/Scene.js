const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db');
const DialogueLine = require('./DialogueLine');
const Asset = require('./Asset');
const SceneAsset = require('./SceneAsset');

class Scene extends Model {}

Scene.init({
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
  assetId: {
    type: DataTypes.UUID,
    references: {
      model: 'assets',
      key: 'id',
    },
    allowNull: true,
  },
  branch: {
    type: DataTypes.STRING,  // New field to specify the branch
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Scene',
  tableName: 'scenes',
  timestamps: true,
});

Scene.hasMany(SceneAsset, { foreignKey: 'sceneId' });
SceneAsset.belongsTo(Scene, { foreignKey: 'sceneId' });

module.exports = Scene;