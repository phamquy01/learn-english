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
import {
  Card as UICard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { text } from 'stream/consumers';
import { LucideChartNoAxesColumnIncreasing } from 'lucide-react';

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

  const images = [
    'b1.jpg',
    'b2.jpg',
    'b3.jpg',
    'b4.jpg',
    'b5.jpg',
    'b6.jpg',
    'b7.jpg',
    'b8.jpg',
    'b9.jpg',
    'b10.jpg',
    'b11.jpg',
    'b12.jpg',
    'b13.jpg',
    'b14.jpg',
    'b15.jpg',
    'b16.jpg',
    'b17.jpg',
    'b18.jpg',
    'b19.jpg',
    'b0.jpg',
  ];

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
        {dataGetFromDBWord.length > 0 &&
          dataGetFromDBWord.map((vocabulary, index) => (
            <motion.div
              key={vocabulary.id}
              className="relative w-52 h-72 [perspective:1000px]"
            >
              <motion.div
                key={vocabulary.id}
                className="w-full h-full [transform-style:preserve-3d] transition-all duration-500"
                animate={{
                  rotateY: isFlipped.includes(index) ? 180 : 0,
                }}
              >
                <motion.div onClick={() => handleFlip(index, vocabulary.word)}>
                  <UICard className="absolute w-full h-full [backface-visibility:hidden]">
                    <CardContent className="flex items-center justify-center h-full ">
                      <Image
                        src={`/images/b${index}.jpg`}
                        alt={`Card front ${index}`}
                        width={150}
                        height={200}
                        priority
                        className="rounded-lg blur-md opacity-50"
                      />
                      <div className="absolute  text-center text-xs lg:text-2xl font-bold p-4">
                        {vocabulary.meaning}
                      </div>
                    </CardContent>
                  </UICard>
                </motion.div>

                <div className="relative w-full h-full backface-hidden [transform:rotateY(180deg)] bg-white rounded-lg shadow-md flex items-center justify-center p-4 flex-col">
                  <Image
                    src={`/images/b${index}.jpg`}
                    alt={`Card front ${index}`}
                    width={150}
                    height={200}
                    priority
                    className="rounded-lg blur-md opacity-50"
                  />
                  <div className="absolute flex flex-col justify-center items-center">
                    <h3 className="text-center text-xs lg:text-2xl font-semibold">
                      {vocabulary.word}
                    </h3>
                    <div className="flex flex-col items-center gap-2 text-gray-400 my-2 text-sm">
                      <p>{vocabulary.type}</p>
                      <p>/{vocabulary.pronounce}/</p>
                    </div>
                    <div className="">
                      <PlayAudio language="en" text={vocabulary.word} />
                    </div>
                  </div>
                </div>
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
