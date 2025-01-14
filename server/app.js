const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require('path');
const { sequelize } = require('./models');
const assetRoutes = require('./routes/assetRoutes');
const userRoutes = require('./routes/userRoutes');
const dialogueRoutes = require('./routes/dialogueRoutes');
const sceneRoutes = require('./routes/sceneRoutes');
const choiceRoutes = require('./routes/choiceRoutes');
const userProgressRoutes = require('./routes/userProgressRoutes');
const cors = require("cors");

const app = express();

app.use(cors({
  origin: 'http://localhost:3001', // Разрешить доступ с вашего фронтенд-сервера
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Разрешенные методы
  allowedHeaders: ['Content-Type', 'Authorization'], // Разрешенные заголовки
}));

app.use(bodyParser.json());
console.log(path)
app.use('/api/users', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', assetRoutes);
app.use('/api', dialogueRoutes);
app.use('/api', sceneRoutes);
app.use('/api', choiceRoutes);
app.use('/api', userProgressRoutes);
sequelize
  .authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Database connection failed:', err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
