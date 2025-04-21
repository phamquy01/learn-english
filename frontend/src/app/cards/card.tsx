'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import apiCardRequests from '@/apiRequests/card';
import { WordsListType } from '@/schemaValidations/card.schema';
import InputCard from '@/app/cards/InputCard';
import PlayAudio from '@/components/playAudio';
import { decodeFromBase26, encodeToBase26 } from '@/lib/utils';
import { Card as UICard } from '@/components/ui/card';

export default function Card({ accessToken = '' }: { accessToken: string }) {
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
    const randomCurrentPageWord = Math.floor(Math.random() * 170);
    router.push(
      `/cards?fc=${flippedCardsParam ?? ''}&cp=${randomCurrentPageWord}`
    );
  };

  useEffect(() => {
    const getWords = async () => {
      try {
        const result = await apiCardRequests.getWords(
          accessToken,
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
  }, [accessToken, currentPageWord]);

  return (
    <div className="flex flex-col-reverse w-full px-8">
      <div className=" flex flex-wrap justify-center items-center gap-4 mb-8">
        {dataGetFromDBWord?.length > 0 &&
          dataGetFromDBWord.map((vocabulary, index) => (
            <motion.div
              key={vocabulary.id}
              className="relative w-52 h-44 [perspective:1000px]"
            >
              <motion.div
                key={vocabulary.id}
                className="w-full h-full [transform-style:preserve-3d] transition-all duration-500"
                animate={{
                  rotateY: isFlipped.includes(index) ? 180 : 0,
                }}
              >
                <motion.div onClick={() => handleFlip(index, vocabulary.word)}>
                  <UICard
                    className={`absolute w-full h-full bg-gray-100 [backface-visibility:hidden]  transition-all duration-300 ease-in-out transform 
                       hover:rotate-1 hover:-translate-y-1 hover:translate-x-1 
                       hover:shadow-xl hover:bg-white/90 ${
                         indexCard === index ? 'border-blue-500' : ''
                       }`}
                  >
                    <div className="flex items-center justify-center h-full ">
                      <div className="absolute text-center text-sm lg:text-xl font-bold p-2 cursor-pointer">
                        {vocabulary.meaning}
                      </div>
                    </div>
                  </UICard>
                </motion.div>

                <UICard className="relative w-full h-full backface-hidden [transform:rotateY(180deg)] bg-white rounded-lg border-green-500 shadow-md flex items-center justify-center p-4 flex-col">
                  <div className="absolute flex flex-col justify-center items-center">
                    <h3 className="text-center text-xl lg:text-2xl font-semibold">
                      {vocabulary.word}
                    </h3>
                    <div className="flex flex-col items-center gap-2 text-gray-400 my-2 text-sm">
                      <p>{vocabulary.type}</p>
                      <p>/{vocabulary.pronounce}/</p>
                    </div>
                    <div>
                      <PlayAudio language="en" text={vocabulary.word} />
                    </div>
                  </div>
                </UICard>
              </motion.div>
            </motion.div>
          ))}
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
