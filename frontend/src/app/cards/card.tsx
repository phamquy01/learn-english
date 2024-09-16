'use client';

import InputCard from '@/app/cards/InputCard';
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  TranslationBodyType,
  TranslationListResType,
} from '@/schemaValidations/translate.schema';
import apiCardRequests from '@/apiRequests/card';

export default function Card({
  dataTranslations,
}: {
  dataTranslations: TranslationListResType;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flippedCardsParam = searchParams.get('fc');
  const base26Chars = 'abcdefghijklmnopqrstuvwxyz';
  const [isFlipped, setIsFlipped] = useState<number[]>(
    flippedCardsParam ? decodeFromBase26(flippedCardsParam) : []
  );
  const [indexCard, setIndexCard] = useState<number>();
  const [saveTranslations, setSaveTranslations] = useState<
    TranslationBodyType[]
  >([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [answer, setAnswer] = useState('');

  const encodeToBase26 = (numbers: number[]): string => {
    const binaryString = numbers
      .map((num) => (1 << num).toString(2))
      .reduce((acc, curr) =>
        (parseInt(acc, 2) | parseInt(curr, 2)).toString(2)
      );

    let decimalValue = parseInt(binaryString, 2);
    let base26String = '';

    while (decimalValue > 0) {
      base26String = base26Chars[decimalValue % 26] + base26String;
      decimalValue = Math.floor(decimalValue / 26);
    }

    if (base26String.length < 2) {
      base26String =
        base26Chars[0].repeat(2 - base26String.length) + base26String;
    } else if (base26String.length > 2) {
      base26String = base26String.slice(-2);
    }

    return base26String;
  };

  function decodeFromBase26(encodedString: string): number[] {
    let decimalValue = 0;

    for (let i = 0; i < encodedString.length; i++) {
      const char = encodedString[i];
      const index = base26Chars.indexOf(char);
      decimalValue = decimalValue * 26 + index;
    }

    const binaryString = decimalValue.toString(2);

    const flippedCards: number[] = [];
    for (let i = 0; i < binaryString.length; i++) {
      if (binaryString[binaryString.length - 1 - i] === '1') {
        flippedCards.push(i);
      }
    }

    return flippedCards;
  }

  const handleFlip = (index: number, text: string) => {
    setIndexCard(index);
    const inputValue = inputRef?.current;
    setAnswer(text);
    inputValue?.focus();
  };

  const updateUrl = (flippedCards: string) => {
    router.push(`/cards?fc=${flippedCards}`, {
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
  };

  const fetchData = async (inpWord: string) => {
    const getListDictionary = apiCardRequests.getDictionary(inpWord);
  };

  useEffect(() => {
    if (dataTranslations.data.translations.length === 0) return;
    const listSaveDataTranslation = dataTranslations.data.translations.filter(
      (saveDataTranslationFromHistory) =>
        saveDataTranslationFromHistory.save === true
    );
    if (listSaveDataTranslation.length) {
      setSaveTranslations(listSaveDataTranslation);
    }
  }, [dataTranslations]);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex items-center justify-center col-span-2">
        {saveTranslations.length > 0 ? (
          saveTranslations.map((saveTranslation, index) => (
            <motion.div
              key={saveTranslation.id}
              className="w-64 h-96 [perspective:1000px] cursor-pointer"
              onClick={() => handleFlip(index, saveTranslation.fromText)}
            >
              <motion.div
                key={saveTranslation.id}
                className="w-full h-full [transform-style:preserve-3d] transition-all duration-500"
                animate={{
                  rotateY: isFlipped.includes(index) ? 180 : 0,
                }}
              >
                {/* Front of the card */}
                <div className="absolute w-full h-full backface-hidden [transform:rotateY(0deg)] bg-white rounded-lg shadow-md flex items-center justify-center p-4">
                  <p className="text-center text-lg font-semibold">
                    {saveTranslation.toText}
                  </p>
                </div>

                {/* Back of the card */}
                <div className="absolute w-full h-full backface-hidden [transform:rotateY(180deg)] bg-white rounded-lg shadow-md flex items-center justify-center p-4">
                  <p className="text-center text-lg font-semibold">
                    {saveTranslation.fromText}
                  </p>
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
        />
      </div>
    </div>
  );
}
