'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import AuthGuard from './AuthGuard';
import axios from 'axios';

const GameWindow = ({ initialSceneId, className }) => {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sceneId, setSceneId] = useState(initialSceneId);
  const [scene, setScene] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState(1);
  const [order, setOrder] = useState(1);
  const [nextSceneId, setNextSceneId] = useState();

  const currentDialogue = useMemo(() => {
    return scene && scene.dialogueLines && scene.dialogueLines[dialogueIndex];
  }, [scene, dialogueIndex]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }
        const response = await axios.get('http://localhost:3000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserId(response.data.user.id);
      } catch (error) {
        console.error('Ошибка при проверке пользователя:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const fetchAllScenes = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3000/api/scenes');
      const data = await res.json();
      const sortedScenes = data.sort((a, b) => a.order - b.order);
      console.log(sortedScenes)
      return sortedScenes;
    } catch (err) {
      console.error('Ошибка загрузки всех сцен:', err);
    }
  }, []);

  const fetchUserProgress = useCallback(async (i) => {
    try {
      const res = await fetch(`http://localhost:3000/api/userprogress/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setSceneId(data.currentSceneId);
      } else {
        const scenes = await fetchAllScenes();
        if (scenes && scenes.length > 0) {
          const firstScene = scenes[0];
          setSceneId(firstScene.id);
          setBranch(firstScene.branch);
          setOrder(firstScene.order)
          if(!i) {
            i = 1
          }
          const nextScene = scenes[i]
          setNextSceneId(nextScene.id)
          await fetch(`http://localhost:3000/api/userprogress`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              currentSceneId: firstScene.id,
              branch: firstScene.branch
            }),
          });
        }
      }
    } catch (err) {
      console.error('Ошибка загрузки прогресса пользователя:', err);
    }
  }, [userId, fetchAllScenes]);

  const fetchScene = useCallback(async (sceneId, order, branch) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/scenes/${sceneId}/${order}/${branch}`, );
      const data = await res.json();
      const sortedDialogueLines = Array.isArray(data.dialogueLines)
        ? data.dialogueLines.sort((a, b) => a.order - b.order)
        : [];
      setScene({ ...data, dialogueLines: sortedDialogueLines });
      setDialogueIndex(0);
    } catch (err) {
      console.error('Ошибка загрузки сцены:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProgress();
  }, [fetchUserProgress]);

  useEffect(() => {
    if (sceneId) {
      fetchScene(sceneId,order, branch); 
    }
  }, [sceneId, fetchScene]);

  useEffect(() => {
    if (!currentDialogue?.text) return;

    setIsTyping(true);
    const text = currentDialogue.text;
    let charIndex = 0;
    let accumulatedText = '';

    const typeCharacter = () => {
      if (charIndex < text.length) {
        accumulatedText += text[charIndex];
        setDisplayedText(accumulatedText);
        charIndex++;
        setTimeout(typeCharacter, 50);
      } else {
        setIsTyping(false);
      }
    };

    typeCharacter();

    return () => {
      setIsTyping(false);
    };
  }, [currentDialogue]);

  const handleNextDialogue = async () => {
    if (!isTyping && scene) {
      if (dialogueIndex < scene.dialogueLines.length - 1) {
        setDialogueIndex(dialogueIndex + 1);
      } else {
        // Загрузка следующей сцены на основе текущего порядка и ветки
        const nextOrder = scene.order + 1;
        try {
            await fetchUserProgress(nextOrder-1)
            fetchScene(nextSceneId, nextOrder, branch);
        } catch (err) {
          console.error('Ошибка загрузки следующей сцены:', err);
        }
      }
    } else if (isTyping) {
      const fullText = currentDialogue?.text || '';
      setDisplayedText(fullText);
      setIsTyping(false);
    }
  };

  if (!scene || isLoading) {
    return <div className="text-white text-center">Загрузка...</div>;
  }

  const backgroundUrl = scene.backgroundAsset ? scene.backgroundAsset.url : '';

  return (
    <AuthGuard>
      <div className={`relative w-full h-full flex flex-col ${className}`} onClick={handleNextDialogue}>
        {backgroundUrl && (
          <Image
            src={backgroundUrl}
            alt="Фон"
            layout="fill"
            objectFit="cover"
            quality={100}
            priority
          />
        )}

        <div className="flex flex-col justify-end h-full z-10">
          {currentDialogue?.characterAsset && (
            <div
              className={`flex items-center ${
                currentDialogue.characterAsset.position === 'left'
                  ? 'justify-start'
                  : currentDialogue.characterAsset.position === 'right'
                  ? 'justify-end'
                  : 'justify-center'
              }`}
            >
              <Image
                src={currentDialogue.characterAsset.url}
                alt={currentDialogue.characterAsset.name}
                layout="fixed"
                width={400} // Фиксированная ширина персонажа
                height={800} // Фиксированная высота персонажа
              />
            </div>
          )}

          {currentDialogue && (
            <div className="bg-gray-800 text-white px-7 py-3 text-lg w-full h-[150px] flex flex-col justify-center mx-auto rounded-lg">
              <div className="text-gray-200 px-2 py-2 rounded-lg text-sm mb-4 inline-block">
                <span className="font-semibold text-yellow-400 whitespace-nowrap">
                  {currentDialogue.characterAsset?.name || ''}
                </span>
              </div>
              <p className="overflow-hidden text-ellipsis">{displayedText}</p>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
};

export default GameWindow;