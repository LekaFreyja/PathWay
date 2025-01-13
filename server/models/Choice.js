const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db');

class Choice extends Model {}

Choice.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  sceneId: {
    type: DataTypes.UUID,
    references: {
      model: 'scenes',
      key: 'id',
    },
    allowNull: false,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nextSceneId: {
    type: DataTypes.UUID,
    references: {
      model: 'scenes',
      key: 'id',
    },
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Choice',
  tableName: 'choices',
  timestamps: true,
});

Choice.associate = function(models) {
  Choice.belongsTo(models.Scene, { foreignKey: 'sceneId', as: 'currentScene' });
  Choice.belongsTo(models.Scene, { foreignKey: 'nextSceneId', as: 'nextScene' });
};

module.exports = Choice;