'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef  } from 'react';
import Image from 'next/image';
import axios from 'axios';
import AuthGuard from '../../components/AuthGuard';


export default function Menu() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const audioRef = useRef(null); // Создаем ссылку на аудио
  useEffect(() => {
    const fetchUser = async () => {
            // Проверяем, есть ли токен перед отправкой запроса
            const token = localStorage.getItem('token');
            if (!token) {
              return;
            }
      try {
        const response = await axios.get('http://localhost:3000/api/users/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);
  const playAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch((err) => {
        console.warn('Автовоспроизведение заблокировано браузером:', err);
      });
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <AuthGuard>
    <div
      className="relative flex items-center justify-end min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: 'url(/images/menu-bg.jpg)', // Укажите путь к фоновому изображению
      }}
      onClick={playAudio}
    >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 py-6">
          <Image
            src="/images/logo.png"
            alt="PATHWAY"
            width={400} // Ширина логотипа
            height={60} // Высота логотипа
            className="object-contain max-w-full h-auto"
          />
        </div>
      <div className="relative w-[80%] sm:w-[40%] lg:w-[30%] xl:w-[25%] max-w-md p-8 bg-black bg-opacity-70 rounded-lg shadow-2xl mr-10">
        <h2 className="text-3xl text-center text-white font-bold mb-8">Меню</h2>
        <div className="flex flex-col gap-6">
          {[ // Основные кнопки меню
            { label: 'Продолжить', path: '/continue' },
            { label: 'Новая игра', path: '/game' },
            { label: 'Настройки', path: '/settings' },
          ].map((button, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(button.path)}
              className="relative w-full px-6 py-3 text-lg font-semibold text-white rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 shadow-md bg-gradient-to-r from-blue-600 to-purple-600 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-600 before:to-blue-600 before:blur-lg before:opacity-0 hover:before:opacity-100"
            >
              <span className="relative z-10">{button.label}</span>
            </button>
          ))}

          {user?.role === 'admin' && ( // Кнопка "Админ-панель" только для администраторов
            <button
              onClick={() => handleNavigation('/admin-page')}
              className="relative w-full px-6 py-3 text-lg font-semibold text-white rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 shadow-md bg-gradient-to-r from-green-600 to-teal-600 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-teal-600 before:to-green-600 before:blur-lg before:opacity-0 hover:before:opacity-100"
            >
              <span className="relative z-10">Админ-панель</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="relative w-full px-6 py-3 text-lg font-semibold text-white rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 shadow-md bg-gradient-to-r from-red-600 to-orange-600 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-orange-600 before:to-red-600 before:blur-lg before:opacity-0 hover:before:opacity-100"
          >
            <span className="relative z-10">Выход</span>
          </button>
        </div>
      </div>
      <style jsx>{`
        button:hover {
          animation: glitch 1s infinite;
        }

        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          25% {
            transform: translate(-2px, 2px);
          }
          50% {
            transform: translate(2px, -2px);
          }
          75% {
            transform: translate(-1px, 1px);
          }
          100% {
            transform: translate(0);
          }
        }
      `}</style>
    </div>

    </AuthGuard>
  );
}
//    <audio ref={audioRef} src="/audio/background-music.mp3" loop preload="auto" /> 