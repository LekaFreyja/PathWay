'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef  } from 'react';
import axios from 'axios';
import AuthGuard from '../components/AuthGuard';


export default function Menu() {
  const router = useRouter();


  useEffect(() => {
    const fetchUser = async () => {
            const token = localStorage.getItem('token');
      try {
        if (!token) {
          router.push('/login')
        }else{
          const response = await axios.get('http://localhost:3000/api/users/me', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          router.push('/menu')
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/login')
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthGuard>
    </AuthGuard>
  );
}
