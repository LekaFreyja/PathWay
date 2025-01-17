"use client"
import { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Пароли не совпадают!');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/api/users/register', { username: nickname, email, password });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Ошибка регистрации пользователя');
    }
  };

  return (
    <div 
    className="flex items-center justify-center min-h-screen bg-gray-900"
    style={{
      backgroundImage: 'url(/images/menu-bg.jpg)',
    }}
    >
      <div className="bg-opacity-75 bg-gray-800 p-8 rounded shadow-md max-w-md w-full">
        <h2 className="text-2xl mb-4 text-center text-white">Регистрация</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400">Nickname</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded">Зарегистрироваться</button>
        </form>
        {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
        <div className="mt-4 flex justify-between text-center">
          <button
            onClick={() => window.location.href = '/forgot-password'}
            className="text-blue-500 underline"
          >
            Забыли пароль?
          </button>
          <button
            onClick={() => window.location.href = '/login'}
            className="text-blue-500 underline ml-4"
          >
            Уже зарегистрированы?
          </button>
        </div>
      </div>
    </div>
  );
}