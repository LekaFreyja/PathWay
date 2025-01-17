const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');  // Для генерации уникального токена
const User = require('../models/User');
const sendEmail = require('../utils/mailer');

require('dotenv').config();

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailToken = uuidv4(); 

    const newUser = await User.create({
      username,
      email,
      password_hash: hashedPassword,
      email_token: emailToken,
    });

    // Отправляем письмо с токеном
    const verificationLink = `http://localhost:3000/api/users/verify/${emailToken}`;
    sendEmail(email, verificationLink, 'Подтверждение регистрации');
    res.status(201).json({ message: 'Успешная регистрация, проверьте почту.', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
};


const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ where: { email_token: token } });

    if (!user) {
      return res.status(404).json({ error: 'Invalid token' });
    }

    user.verified = true;
    user.email_token = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error verifying email' });
  }
};



const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = uuidv4();
    user.reset_token = resetToken;
    await user.save();

    // Отправляем письмо с ссылкой на сброс
    const resetLink = `http://localhost:3000/api/users/reset-password/${resetToken}`;
    sendEmail(
      email,
      'Сброс пароля',
      `Перейдите по ссылке для сброса пароля: ${resetLink}`
    );

    res.status(200).json({ message: 'Password reset link sent' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending reset email' });
  }
};

// Установка нового пароля
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ where: { reset_token: token } });

    if (!user) {
      return res.status(404).json({ error: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password_hash = hashedPassword;
    user.reset_token = null;  // Очищаем токен после смены пароля
    await user.save();

    res.status(200).json({ message: 'Password successfully reset' });
  } catch (error) {
    res.status(500).json({ error: 'Error resetting password' });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Генерация JWT с ролью
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },  // Добавляем роль
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};
// Обновление роли пользователя (админ может менять роли)
const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: 'User role updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user role' });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['username', 'email', 'role', 'verified'],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

module.exports = { registerUser, verifyEmail, loginUser, requestPasswordReset, resetPassword, updateUserRole, getAllUsers };

