// models/Asset.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db');

class Asset extends Model {}

Asset.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['background', 'character', 'item', 'other']],
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['left', 'left-center', 'center', 'right-center', 'right']], // Новая валидация для позиции
      },
      defaultValue: 'center', // Позиция по умолчанию
    },
  },
  {
    sequelize,
    modelName: 'Asset',
    tableName: 'assets',
    timestamps: true,
  }
);
module.exports = Asset;
