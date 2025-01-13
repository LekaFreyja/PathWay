'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('background');
  const [assets, setAssets] = useState([]);
  const [scene, setScene] = useState({ title: '', description: '', background_id: '' });
  const [scenes, setScenes] = useState([]);  // <== Добавляем состояние для сцен
  const [role, setRole] = useState(null);
  const [dialogue, setDialogue] = useState({ scene_id: '', text: '', order: '', character_name: '' });
  const [sceneCharacter, setSceneCharacter] = useState({ scene_id: '', asset_id: '', position: 'left' });
  const [choice, setChoice] = useState({ scene_id: '', text: '', next_scene_id: '' });
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Проверка роли пользователя при заходе на страницу
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await axios.get('http://localhost:3000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.role !== 'admin') {
          router.push('/login');
        } else {
          setRole(res.data.role);
        }
      } catch (error) {
        console.error('Ошибка проверки роли:', error);
        router.push('/login');
      }
    };

    fetchUserRole();
    fetchAssets();
    fetchScenes()
  }, []);
  const fetchScenes = async () => {
    const res = await axios.get('http://localhost:3000/api/admin/scenes', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setScenes(res.data);
  };

  // Получение ассетов (фонов и персонажей)
  const fetchAssets = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/assets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssets(res.data);
    } catch (error) {
      console.error('Ошибка загрузки ассетов:', error);
    }
  };
  const handleAddDialogue = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/admin/dialogue', dialogue, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Диалог добавлен');
      setDialogue({ scene_id: '', text: '', order: '', character_name: '' });
    } catch (error) {
      console.error('Ошибка добавления диалога:', error);
    }
  };

  // Добавляем персонажа в сцену
  const handleAddCharacter = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/admin/scene-character', sceneCharacter, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Персонаж добавлен в сцену');
      setSceneCharacter({ scene_id: '', asset_id: '', position: 'left' });
    } catch (error) {
      console.error('Ошибка добавления персонажа:', error);
    }
  };

  // Добавляем выбор для сцены
  const handleAddChoice = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/admin/choice', choice, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Выбор добавлен');
      setChoice({ scene_id: '', text: '', next_scene_id: '' });
    } catch (error) {
      console.error('Ошибка добавления выбора:', error);
    }
  };
  // Загрузка файлов
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAssetUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Выберите файл для загрузки');
      return;
    }

    const formData = new FormData();
    formData.append('asset', file);
    formData.append('name', name);
    formData.append('type', type);

    try {
      await axios.post('http://localhost:3000/api/admin/upload-asset', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Фон успешно загружен!');
      fetchAssets();  // Обновляем список фонов
      setName('');
      setFile(null);

    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      alert('Ошибка загрузки файла');
    }
  };

  // Создание сцены
  const handleSceneChange = (e) => {
    setScene({ ...scene, [e.target.name]: e.target.value });
  };

  const handleSceneSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3000/api/admin/scene', scene, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Сцена успешно добавлена!');
      setScene({ title: '', description: '', background_id: '' });
    } catch (error) {
      console.error('Ошибка добавления сцены:', error);
      alert('Ошибка при добавлении сцены');
    }
  };

  if (!role) {
    return <div className="h-screen flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
    <h1 className="text-4xl font-extrabold mb-8 text-center">Админская панель</h1>
    
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
      {/* Форма загрузки ассетов */}
      <form onSubmit={handleAssetUpload} className="bg-gray-800 p-8 rounded-lg shadow-2xl">
        <h2 className="text-2xl font-semibold mb-6">Загрузка фона или персонажа</h2>
        <input
          type="text"
          placeholder="Название ассета"
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="background">Фон</option>
          <option value="character">Персонаж</option>
        </select>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full p-2 mb-6 cursor-pointer"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 p-3 rounded-lg hover:bg-blue-700 transition"
        >
          Загрузить ассет
        </button>
      </form>
      
      {/* Форма добавления сцены */}
      <form onSubmit={handleSceneSubmit} className="bg-gray-800 p-8 rounded-lg shadow-2xl">
        <h2 className="text-2xl font-semibold mb-6">Добавить сцену</h2>
        <input
          name="title"
          placeholder="Название сцены"
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500"
          onChange={handleSceneChange}
          required
        />
        <textarea
          name="description"
          placeholder="Описание"
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500"
          onChange={handleSceneChange}
          required
        ></textarea>
        <select
          name="background_id"
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500"
          onChange={handleSceneChange}
          required
        >
          <option value="">Выберите фон</option>
          {assets.filter((a) => a.type === 'background').map((asset) => (
            <option key={asset.id} value={asset.id}>{asset.name}</option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-green-600 p-3 rounded-lg hover:bg-green-700 transition"
        >
          Добавить сцену
        </button>
      </form>

      {/* Добавление диалога */}
      <form onSubmit={handleAddDialogue} className="bg-gray-800 p-8 rounded-lg shadow-2xl">
        <h2 className="text-2xl font-semibold mb-6">Добавить диалог</h2>
        <select
          onChange={(e) => setDialogue({ ...dialogue, scene_id: e.target.value })}
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-yellow-500"
        >
          <option value="">Выберите сцену</option>
          {scenes.map((scene) => (
            <option key={scene.id} value={scene.id}>{scene.title}</option>
          ))}
        </select>
        <input
          placeholder="Текст диалога"
          onChange={(e) => setDialogue({ ...dialogue, text: e.target.value })}
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-yellow-500"
          required
        />
        <input
          placeholder="Имя персонажа"
          onChange={(e) => setDialogue({ ...dialogue, character_name: e.target.value })}
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg"
        />
        <input
          placeholder="Порядок"
          onChange={(e) => setDialogue({ ...dialogue, order: e.target.value })}
          className="w-full p-3 mb-6 bg-gray-700 rounded-lg"
          required
        />
        <button type="submit" className="w-full bg-yellow-600 p-3 rounded-lg hover:bg-yellow-700 transition">
          Добавить диалог
        </button>
      </form>
      {/* Добавление персонажа в сцену */}
      <form onSubmit={handleAddCharacter} className="bg-gray-800 p-8 rounded-lg shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6">Добавить персонажа</h2>
          <select
            onChange={(e) => setSceneCharacter({ ...sceneCharacter, scene_id: e.target.value })}
            className="w-full p-3 mb-4 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Выберите сцену</option>
            {scenes.map((scene) => (
              <option key={scene.id} value={scene.id}>{scene.title}</option>
            ))}
          </select>
          <select
            onChange={(e) => setSceneCharacter({ ...sceneCharacter, asset_id: e.target.value })}
            className="w-full p-3 mb-4 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Выберите персонажа</option>
            {assets.filter((asset) => asset.type === 'character').map((asset) => (
              <option key={asset.id} value={asset.id}>{asset.name}</option>
            ))}
          </select>
          <select
            onChange={(e) => setSceneCharacter({ ...sceneCharacter, position: e.target.value })}
            className="w-full p-3 mb-6 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500"
          >
            <option value="left">Слева</option>
            <option value="center">Центр</option>
            <option value="right">Справа</option>
          </select>
          <button type="submit" className="w-full bg-purple-600 p-3 rounded-lg hover:bg-purple-700 transition">
            Добавить персонажа в сцену
          </button>
        </form>
    </div>
  </div>
  );
}
