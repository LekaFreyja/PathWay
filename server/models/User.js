const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  email_token: { type: DataTypes.STRING, allowNull: true },
  reset_token: { type: DataTypes.STRING, allowNull: true },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',  // По умолчанию обычный пользователь
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,  // Поле для хранения URL аватара
  },
});

module.exports = User;