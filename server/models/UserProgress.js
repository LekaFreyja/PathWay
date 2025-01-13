const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db');

class UserProgress extends Model {}

UserProgress.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  currentSceneId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'scenes',
      key: 'id',
    },
  },
  branch: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  choices: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'UserProgress',
  tableName: 'user_progress',
  timestamps: true,
});

module.exports = UserProgress;