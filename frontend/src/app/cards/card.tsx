'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import apiCardRequests from '@/apiRequests/card';
import { WordsListType } from '@/schemaValidations/card.schema';
import InputCard from '@/app/cards/InputCard';
import PlayAudio from '@/components/playAudio';
import { set } from 'zod';
import { decodeFromBase26, encodeToBase26 } from '@/lib/utils';

export default function Card() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flippedCardsParam = searchParams.get('fc');
  const currentPageWord = searchParams.get('cp');
  const [isFlipped, setIsFlipped] = useState<number[]>(
    flippedCardsParam ? decodeFromBase26(flippedCardsParam) : []
  );
  const [indexCard, setIndexCard] = useState<number>();
  const [dataGetFromDBWord, setDataGetFromDBWord] = useState<WordsListType>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [answer, setAnswer] = useState('');
  const [isDisabledInput, setIsDisabledInput] = useState<boolean>(false);

  console.log('flippedCardsParam', searchParams);
  console.log('isFlipped', isFlipped);
  console.log('indexCard', indexCard);
  console.log('cp', currentPageWord);

 

  const handleFlip = (index: number, text: string) => {
    setIsDisabledInput(false);
    setIndexCard(index);
    const inputValue = inputRef?.current;
    setAnswer(text);
    inputValue?.focus();
  };

  const updateUrl = (flippedCards: string) => {
    router.push(`/cards?fc=${flippedCards}&cp=${currentPageWord ?? 1}`, {
      scroll: false,
    });
  };

  const onFlipSubmit = (index: number) => {
    const updatedFlipped = [...isFlipped, index];
    const newUpdateFlipped = updatedFlipped.filter(
      (item, idx) => updatedFlipped.indexOf(item) === idx
    );

    setIsFlipped(updatedFlipped);
    updateUrl(encodeToBase26(newUpdateFlipped));
    setIsDisabledInput(true);
  };

  const handleResfresh = () => {
    setIsFlipped([]);
    setIndexCard(undefined);
    const nextPageWord = currentPageWord ? +currentPageWord + 1 : 1;
    router.push(`/cards?fc=&cp=${nextPageWord}`);
  };

  useEffect(() => {
    const getWords = async () => {
      try {
        const result = await apiCardRequests.getWords(
          +(currentPageWord ?? 1),
          20
        );
        setDataGetFromDBWord(result.payload.words);
      } catch (error) {
        console.error('Error fetching data:', error);
        return null;
      }
    };
    getWords();
  }, [currentPageWord]);

  return (
    <div className="flex flex-col-reverse w-full px-8">
      <div className="grid grid-cols-3 gap-4 lg:grid-cols-5">
        {dataGetFromDBWord.length > 0 ? (
          dataGetFromDBWord.map((vocabulary, index) => (
            <motion.div
              key={vocabulary.id}
              className="w-32 h-32 lg:w-52 lg:h-52 mx-auto [perspective:1000px] cursor-pointer"
            >
              <motion.div
                key={vocabulary.id}
                className="w-full h-full [transform-style:preserve-3d] transition-all duration-500"
                animate={{
                  rotateY: isFlipped.includes(index) ? 180 : 0,
                }}
              >
                {/* Front of the card */}
                <motion.div onClick={() => handleFlip(index, vocabulary.word)}>
                  <div className="absolute w-full h-full backface-hidden [transform:rotateY(0deg)] bg-gray-100 rounded-lg shadow-md flex items-center justify-center p-4">
                    <p className="text-center text-xs lg:text-xl font-semibold">
                      {vocabulary.meaning}
                    </p>
                  </div>
                </motion.div>

                {/* Back of the card */}
                <div className="absolute w-full h-full backface-hidden [transform:rotateY(180deg)] bg-gray-100 rounded-lg shadow-md flex items-center justify-center p-4 flex-col">
                  <h3 className="text-center text-xs lg:text-2xl font-semibold">
                    {vocabulary.word}
                  </h3>
                  <div className="flex gap-2 text-gray-400 my-2 text-sm">
                    <p>{vocabulary.type}</p>
                    <p>/{vocabulary.pronounce}/</p>
                  </div>
                  <div className="absolute bottom-8">
                    <PlayAudio language="en" text={vocabulary.word} />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))
        ) : (
          <h1>Bạn chưa có từ mới nào</h1>
        )}
      </div>
      <div>
        <InputCard
          answer={answer}
          ref={inputRef}
          indexCard={indexCard}
          setIsFlipped={onFlipSubmit}
          isDisabledInput={isDisabledInput}
          handleResfresh={handleResfresh}
        />
      </div>
    </div>
  );
}
