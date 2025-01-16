'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import AuthGuard from './AuthGuard';
import axios from 'axios';

const GameWindow = ({ initialSceneId, flag, className = '', isFullScreen = false }) => {
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
  const [transition, setTransition] = useState(false);  // Новое состояние для анимации

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
      if(flag) return;
      const res = await fetch(`http://localhost:3000/api/userprogress/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setSceneId(data.currentSceneId);
      } else {
        if(flag) return;
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
        const res = await fetch(`http://localhost:3000/api/scenes/${sceneId}/${order}/${branch}`);
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
        fetchScene(sceneId, order, branch); 
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
    if (isTyping) {
      setDisplayedText(currentDialogue?.text || '');
      setIsTyping(false);
      return;
    }
  
    if (dialogueIndex < scene.dialogueLines.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
      return;
    }
  
    setTransition(true);
  
    await new Promise((resolve) => setTimeout(resolve, 500));
  
    try {
      const nextScene = await fetchNextScene(scene.order + 1);
      if (nextScene) {
        await fetchScene(nextScene.id, nextScene.order, nextScene.branch);
      }
    } catch (err) {
      console.error('Ошибка загрузки следующей сцены:', err);
    } finally {
      setTransition(false);
    }
  };
  

const fetchNextScene = async (nextOrder) => {
    try {
        const scenes = await fetchAllScenes();
        return scenes.find(scene => scene.order === nextOrder);
    } catch (err) {
        console.error('Ошибка загрузки следующей сцены:', err);
        return null;
    }
};

  if (!scene || isLoading) {
    return <div className="text-white text-center">Загрузка...</div>;
  }

  const backgroundUrl = scene.backgroundAsset ? scene.backgroundAsset.url : '';

  const containerClass = isFullScreen ? 'w-screen h-screen' : 'w-full h-full';

  return (
    <AuthGuard>
      <div
        className={`relative ${containerClass} flex flex-col ${className} ${
          transition ? 'fade-out' : 'fade-in'
        }`}
        onClick={handleNextDialogue}
      >
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
                width={400}
                height={800}
              />
            </div>
          )}
          {currentDialogue && (
            <div className="dialogue-container mx-auto">
              <div className="character-name">
                <span>{currentDialogue.characterAsset?.name || ''}</span>
              </div>
              <p className="dialogue-text">{displayedText}</p>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.8s ease-in-out forwards;
        }
        .fade-out {
          animation: fadeOut 0.8s ease-in-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(1.05);
          }
        }
        .dialogue-container {
          background: linear-gradient(135deg, rgba(33, 37, 41, 0.9), rgba(55, 65, 81, 0.9));
          border: 2px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 16px 24px;
          width: 95%;
          max-width: 100%;
          margin-bottom: 20px;
          position: relative;
        }
        .character-name {
          position: absolute;
          top: -20px;
          left: 16px;
          background: linear-gradient(135deg, #ff7e5f, #feb47b);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: bold;
          color: #ffffff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .dialogue-text {
          font-size: 1.2rem;
          line-height: 1.8;
          color: #e5e7eb;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }
        @media (max-width: 768px) {
          .dialogue-container {
            width: 95%;
            padding: 12px 16px;
          }
          .dialogue-text {
            font-size: 1rem;
          }
          .character-name {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </AuthGuard>
  );
};

export default GameWindow;