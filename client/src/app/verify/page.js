"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      axios.get(`http://localhost:3000/api/users/verify/${token}`)
        .then(response => setMessage(response.data.message))
        .catch(error => setMessage('Error verifying email'));
    }
  }, [token]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Email Verification</h2>
      {message ? (
        <p>{message}</p>
      ) : (
        <p>Verifying your email, please wait...</p>
      )}
    </div>
  );
}