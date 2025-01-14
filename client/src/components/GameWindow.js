// client/src/app/components/GameWindow.js
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import AuthGuard from './AuthGuard';

const GameWindow = ({ initialSceneId, className }) => {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sceneId, setSceneId] = useState(initialSceneId);

  const [scene, setScene] = useState(null);
  const currentDialogue = useMemo(() => {
    return scene && scene.dialogueLines && scene.dialogueLines[dialogueIndex];
  }, [scene, dialogueIndex]);

  const fetchScene = useCallback(async (sceneId) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/scenes/${sceneId}`);
      const data = await res.json();
      const sortedDialogueLines = data.dialogueLines.sort((a, b) => a.order - b.order);
      setScene({ ...data, dialogueLines: sortedDialogueLines });
      setDialogueIndex(0);
    } catch (err) {
      console.error('Ошибка загрузки сцены:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScene(sceneId);
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

  const handleNextDialogue = () => {
    if (!isTyping && scene && dialogueIndex < scene.dialogueLines.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
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
      <div
        className={`relative w-full h-full flex flex-col ${className}`}
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
              className={`flex items-center ${currentDialogue.characterAsset.position === 'left'
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