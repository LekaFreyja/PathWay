//'use client';
//
//import { useEffect, useState } from 'react';
//import Image from 'next/image';
//import AuthGuard from '../../components/AuthGuard';
//
//const GamePage = () => {
//  const [scene, setScene] = useState(null); // Текущая сцена
//  const [dialogueIndex, setDialogueIndex] = useState(0); // Индекс текущей строки диалога
//  const [displayedText, setDisplayedText] = useState(''); // Текст с "анимацией набора"
//  const [isTyping, setIsTyping] = useState(false); // Флаг для анимации текста
//  const [isLoading, setIsLoading] = useState(false); // Флаг для загрузки данных
//
//  // Загрузка первой сцены
//  useEffect(() => {
//    fetchScene('first');
//  }, []);
//
//  const fetchScene = async (sceneId) => {
//    setIsLoading(true);
//    try {
//      const res = await fetch(`http://localhost:3000/api/scenes/${sceneId}`);
//      const data = await res.json();
//      const sortedDialogueLines = data.dialogueLines.sort((a, b) => a.order - b.order);
//      setScene({ ...data, dialogueLines: sortedDialogueLines });
//      setDialogueIndex(0); // Сбрасываем индекс диалога
//    } catch (err) {
//      console.error('Ошибка загрузки сцены:', err);
//    } finally {
//      setIsLoading(false);
//    }
//  };
//
//  useEffect(() => {
//    if (!scene || !scene.dialogueLines) return;
//  
//    const currentDialogue = scene.dialogueLines[dialogueIndex];
//    if (currentDialogue && currentDialogue.text) {
//      setIsTyping(true); // Устанавливаем флаг набора текста
//      const text = currentDialogue.text;
//      let charIndex = 0; // Индекс текущего символа
//      let accumulatedText = ""; // Текст, который будет показан
//  
//      // Функция для поэтапного добавления текста
//      const typeCharacter = () => {
//        if (charIndex < text.length) {
//          accumulatedText += text[charIndex];
//          setDisplayedText(accumulatedText); // Обновляем текст в состоянии
//          charIndex++;
//          setTimeout(typeCharacter, 50); // Задержка между символами
//        } else {
//          setIsTyping(false); // Завершаем анимацию
//        }
//      };
//  
//      typeCharacter(); // Запускаем набор текста
//  
//      return () => {
//        setIsTyping(false); // Очистка флага при размонтировании
//      };
//    }
//  }, [scene, dialogueIndex]);
//
//  // Переход к следующей строке
//  const handleNextDialogue = () => {
//    if (!isTyping && scene && dialogueIndex < scene.dialogueLines.length - 1) {
//      setIsLoading(true);
//      setTimeout(() => {
//        setDialogueIndex(dialogueIndex + 1);
//        setIsLoading(false);
//      }, 100); // Ждем, пока загрузятся данные
//    } else if (isTyping) {
//      // Завершаем набор текста
//      const fullText = scene.dialogueLines[dialogueIndex]?.text || '';
//      setDisplayedText(fullText);
//      setIsTyping(false);
//    } else {
//      console.log('Завершена сцена, переход к следующей');
//    }
//  };
//
//  if (!scene || isLoading) {
//    return <div className="text-white text-center">Загрузка...</div>;
//  }
//
//  const currentDialogue =
//    scene.dialogueLines && scene.dialogueLines.length > 0
//      ? scene.dialogueLines[dialogueIndex]
//      : null;
//
//  const backgroundUrl = scene.backgroundAsset ? scene.backgroundAsset.url : '';
//
//  return (
//    <AuthGuard>
//      <div className="relative w-screen h-screen flex flex-col" 
//      onClick={handleNextDialogue}
//      >
//        {backgroundUrl && (
//          <Image
//            src={backgroundUrl}
//            alt="Фон"
//            layout="fill"
//            objectFit="cover"
//            quality={100}
//            priority
//          />
//        )}
//
//        {/* Контейнер для контента */}
//        <div className="flex flex-col justify-end h-full z-10">
//          {/* Персонаж */}
//          {currentDialogue?.characterAsset && (
//            <div
//              className={`flex items-center pt-[1vh] ${
//                currentDialogue.characterAsset.position === 'left'
//                  ? 'justify-start'
//                  : currentDialogue.characterAsset.position === 'left-center'
//                  ? 'justify-start ml-12'
//                  : currentDialogue.characterAsset.position === 'center'
//                  ? 'justify-center'
//                  : currentDialogue.characterAsset.position === 'right-center'
//                  ? 'justify-end mr-12'
//                  : currentDialogue.characterAsset.position === 'right'
//                  ? 'justify-end'
//                  : 'justify-center'
//              }`}
//            >
//              <Image
//                src={currentDialogue.characterAsset.url}
//                alt={currentDialogue.characterAsset.name}
//                layout="intrinsic"
//                width={500}
//                height={750}
//              />
//            </div>
//          )}
//
//          {/* Диалоговое окно с фиксированной высотой */}
//          {currentDialogue && (
//            <div className="bg-gray-800 text-white px-7 py-3 text-lg h-[20vh] flex flex-col relative">
//              {/* Имя персонажа */}
//              <div className="top-[1rem] left-2 bg-opacity-70 px-4 py-2 rounded-full text-sm text-gray-200 font-semibold">
//                {currentDialogue.characterAsset?.name || ''}
//              </div>
//              {/* Текст с анимацией */}
//              <p>{displayedText}</p>
//            </div>
//          )}
//        </div>
//      </div>
//    </AuthGuard>
//  );
//};
//
//export default GamePage;
'use client'; 
//
//import { useEffect, useState, useCallback, useMemo } from 'react';
//import Image from 'next/image';
//import AuthGuard from '../../components/AuthGuard';
//
//const GamePage = () => {
//  const [dialogueIndex, setDialogueIndex] = useState(0); // Индекс текущей строки диалога
//  const [displayedText, setDisplayedText] = useState(''); // Текст с "анимацией набора"
//  const [isTyping, setIsTyping] = useState(false); // Флаг для анимации текста
//  const [isLoading, setIsLoading] = useState(false); // Флаг для загрузки данных
//  const [sceneId, setSceneId] = useState('first'); // Идентификатор текущей сцены
//
//  const [scene, setScene] = useState(null); // Текущая сцена
//  const currentDialogue = useMemo(() => {
//    return scene && scene.dialogueLines && scene.dialogueLines[dialogueIndex];
//  }, [scene, dialogueIndex]);
//
//  const fetchScene = useCallback(async (sceneId) => {
//    setIsLoading(true);
//    try {
//      const res = await fetch(`http://localhost:3000/api/scenes/${sceneId}`);
//      const data = await res.json();
//      const sortedDialogueLines = data.dialogueLines.sort((a, b) => a.order - b.order);
//      setScene({ ...data, dialogueLines: sortedDialogueLines });
//      setDialogueIndex(0); // Сбрасываем индекс диалога
//    } catch (err) {
//      console.error('Ошибка загрузки сцены:', err);
//    } finally {
//      setIsLoading(false);
//    }
//  }, []);
//
//  useEffect(() => {
//    fetchScene(sceneId);
//  }, [sceneId, fetchScene]);
//
//  useEffect(() => {
//    if (!currentDialogue?.text) return;
//    
//    setIsTyping(true); // Устанавливаем флаг набора текста
//    const text = currentDialogue.text;
//    let charIndex = 0; // Индекс текущего символа
//    let accumulatedText = ''; // Текст, который будет показан
//
//    const typeCharacter = () => {
//      if (charIndex < text.length) {
//        accumulatedText += text[charIndex];
//        setDisplayedText(accumulatedText); // Обновляем текст в состоянии
//        charIndex++;
//        setTimeout(typeCharacter, 50); // Задержка между символами
//      } else {
//        setIsTyping(false); // Завершаем анимацию
//      }
//    };
//
//    typeCharacter();
//
//    return () => {
//      setIsTyping(false); // Очистка флага при размонтировании
//    };
//  }, [currentDialogue]);
//
//  const handleNextDialogue = () => {
//    if (!isTyping && scene && dialogueIndex < scene.dialogueLines.length - 1) {
//      setDialogueIndex(dialogueIndex + 1);
//    } else if (isTyping) {
//      // Завершаем набор текста
//      const fullText = currentDialogue?.text || '';
//      setDisplayedText(fullText);
//      setIsTyping(false);
//    }
//  };
//
//  if (!scene || isLoading) {
//    return <div className="text-white text-center">Загрузка...</div>;
//  }
//
//  const backgroundUrl = scene.backgroundAsset ? scene.backgroundAsset.url : '';
//
//  return (
//    <AuthGuard>
//      <div
//        className="relative w-screen h-screen flex flex-col"
//        onClick={handleNextDialogue}
//      >
//        {backgroundUrl && (
//          <Image
//            src={backgroundUrl}
//            alt="Фон"
//            layout="fill"
//            objectFit="cover"
//            quality={100}
//            priority
//          />
//        )}
//
//        <div className="flex flex-col justify-end h-full z-10">
//          {currentDialogue?.characterAsset && (
//            <div
//              className={`flex items-center ${currentDialogue.characterAsset.position === 'left'
//                  ? 'justify-start'
//                  : currentDialogue.characterAsset.position === 'right'
//                  ? 'justify-end'
//                  : 'justify-center'
//                }`}
//            >
//              <Image
//                src={currentDialogue.characterAsset.url}
//                alt={currentDialogue.characterAsset.name}
//                layout="fixed"
//                width={400} // Фиксированная ширина персонажа
//                height={800} // Фиксированная высота персонажа
//              />
//            </div>
//          )}
//
//{currentDialogue && (
//  <div className="bg-gray-800 text-white px-7 py-3 text-lg w-full h-[150px] flex flex-col justify-center mx-auto rounded-lg">
//    <div className="text-gray-200 px-2 py-2 rounded-lg text-sm mb-4 inline-block">
//      <span className="font-semibold text-yellow-400 whitespace-nowrap">
//        {currentDialogue.characterAsset?.name || ''}
//      </span>
//    </div>
//    <p className="overflow-hidden text-ellipsis">{displayedText}</p>
//  </div>
//)}
//
//        </div>
//      </div>
//    </AuthGuard>
//  );
//};
//
//export default GamePage;

'use client';

import GameWindow from '../../components/GameWindow';

const GamePage = () => {
  return <GameWindow/>;
};

export default GamePage;