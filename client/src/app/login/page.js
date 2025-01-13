"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/users/login', { email, password });
      console.log(response)
      if (response.status === 200) {
        // Сохранение токена в localStorage
        localStorage.setItem('token', response.data.token);

        // Перенаправление на меню
        window.location.href = '/menu';
      } else {
        setMessage(response.data.message || 'Login failed');
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error logging in');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded shadow-md max-w-md w-full">
        <h2 className="text-2xl mb-4 text-center text-white">Login</h2>
        <form onSubmit={handleLogin}>
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
            <label className="block text-gray-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded">
            Login
          </button>
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
            onClick={() => window.location.href = '/register'}
            className="text-blue-500 underline ml-4"
          >
            Нет аккаунта?
          </button>
        </div>
      </div>
    </div>
  );
}
