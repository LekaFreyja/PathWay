'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import AuthGuard from '../../components/AuthGuard';

export default function Menu() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
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
          backgroundImage: 'url(/images/menu-bg.jpg)',
        }}
        onClick={playAudio}
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 py-6">
          <Image
            src="/images/logo.png"
            alt="PATHWAY"
            width={400}
            height={60}
            className="object-contain max-w-full h-auto"
          />
        </div>
        <div className="relative w-[80%] sm:w-[40%] lg:w-[30%] xl:w-[25%] max-w-md p-8 bg-black bg-opacity-70 rounded-lg shadow-2xl mr-10">
          <h2 className="text-3xl text-center text-white font-bold mb-8">Меню</h2>
          <div className="flex flex-col gap-6">
            {[
              { label: 'Продолжить', path: '/continue' },
              { label: 'Новая игра', path: '/game' },
              { label: 'Настройки', path: '/settings' },
            ].map((button, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(button.path)}
                className="relative w-full px-6 py-3 text-lg font-semibold text-white rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 shadow-md bg-gradient-to-r from-blue-500 to-indigo-500 glitch"
              >
                <span className="relative z-10">{button.label}</span>
              </button>
            ))}

            {user?.role === 'admin' && (
              <button
                onClick={() => handleNavigation('/admin-page')}
                className="relative w-full px-6 py-3 text-lg font-semibold text-white rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 shadow-md bg-gradient-to-r from-green-500 to-teal-500 glitch"
              >
                <span className="relative z-10">Админ-панель</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="relative w-full px-6 py-3 text-lg font-semibold text-white rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 shadow-md bg-gradient-to-r from-red-600 to-red-800 glitch"
            >
              <span className="relative z-10">Выход</span>
            </button>
          </div>
        </div>

        <style jsx>{`
          .glitch {
            position: relative;
          }

          .glitch:hover .glitch-layer {
            animation: glitch 1s infinite;
          }

          .glitch-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: inherit;
            animation: none;
            opacity: 0.6;
            mix-blend-mode: screen;
          }

          .glitch-layer:nth-child(2) {
            clip: rect(2px, 150px, 6px, 0);
            left: 2px;
          }

          .glitch-layer:nth-child(3) {
            clip: rect(85px, 9999px, 90px, 0);
            left: -2px;
          }

          .glitch-layer:nth-child(4) {
            clip: rect(60px, 9999px, 65px, 0);
            left: 2px;
          }

          @keyframes glitch {
            0% {
              transform: translate(0);
            }
            20% {
              transform: translate(-2px, -2px);
            }
            40% {
              transform: translate(2px, 2px);
            }
            60% {
              transform: translate(-2px, 2px);
            }
            80% {
              transform: translate(2px, -2px);
            }
            100% {
              transform: translate(0);
            }
          }
        `}</style>
      </div>
      <audio ref={audioRef} src="/audio/background-music.mp3" loop preload="auto" />
    </AuthGuard>
  );
}