const express = require('express');
const {
  registerUser,
  loginUser,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  updateUserRole,
  getAllUsers
} = require('../controllers/userController');
const authenticateJWT = require('../middleware/authMiddleware')
const isAdmin = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.get('/users', getAllUsers);
router.post('/login', loginUser);
router.get('/verify/:token', verifyEmail);
router.get('/me', authenticateJWT, (req, res) => {
  res.status(200).json({ user: req.user });
});
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);
router.put('/update-role', authenticateJWT, isAdmin, updateUserRole);

module.exports = router;
