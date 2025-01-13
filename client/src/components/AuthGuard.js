'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AuthGuard({ children, requiredRole }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем, есть ли токен в localStorage и запрашиваем данные о пользователе
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // Если токена нет, перенаправляем на страницу логина
          router.push('/login');
          return;
        }

        const response = await axios.get('http://localhost:3000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);

        // Если роль не совпадает с требуемой, перенаправляем на главную
        if (requiredRole && response.data.user.role !== requiredRole) {
          router.push('/');
        }
      } catch (error) {
        console.error('Ошибка при проверке пользователя:', error);
        setUser(null);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, requiredRole]);

  if (loading) {
    return <div className="text-center text-white">Загрузка...</div>;
  }

  if (!user) {
    return null; // Пока мы не получили пользователя, ничего не рендерим
  }

  // Если пользователь есть и его роль подходит, показываем children
  return <>{children}</>;
}
