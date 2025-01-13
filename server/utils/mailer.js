const nodemailer = require('nodemailer');
require('dotenv').config();

// Настройка SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru',  // Подходит для Gmail, для других сервисов меняем хост
  port: 465,
  secure: true,  // true для 465, false для других портов
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Функция для отправки письма
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Game Novel" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
