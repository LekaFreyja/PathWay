const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, verificationLink, subject ) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #003366;">Подтверждение регистрации</h2>
      <p>Спасибо за регистрацию! Пожалуйста, подтвердите вашу почту, нажав на кнопку ниже.</p>
      <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #003366; color: #fff; text-decoration: none; border-radius: 5px;">Подтвердить почту</a>
      <p>Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"PATHWAY" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;