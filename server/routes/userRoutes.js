const express = require('express');
const {
  registerUser,
  loginUser,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  updateUserRole,
} = require('../controllers/userController');
const authenticateJWT = require('../middleware/authMiddleware')
const isAdmin = require('../middleware/roleMiddleware');

const router = express.Router();

// Регистрация
router.post('/register', registerUser);

// Логин
router.post('/login', loginUser);

// Подтверждение email
router.get('/verify/:token', verifyEmail);

router.get('/me', authenticateJWT, (req, res) => {
  res.status(200).json({ user: req.user });
});
// Запрос на сброс пароля
router.post('/request-password-reset', requestPasswordReset);

// Установка нового пароля
router.post('/reset-password/:token', resetPassword);

// Обновление роли пользователя (admin)
router.put('/update-role', authenticateJWT, isAdmin, updateUserRole);

module.exports = router;
