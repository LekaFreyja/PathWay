const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();  // Пользователь админ — продолжаем выполнение
    } else {
      res.status(403).json({ error: 'Access denied. Admins only' });
    }
  };
  
  module.exports = isAdmin;