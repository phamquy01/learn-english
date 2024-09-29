'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Hompage() {
  const router = useRouter();

  const handleNavigateTranslation = () => {
    router.push('/translate');
  };
  return (
    <div className="px-10 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-center my-20">
        Welcome to Translate
      </h1>
      <button
        className="w-[200px] h-[50px] border-solid border-2 border-indigo-600 rounded-md bg-indigo-600 text-[#fff]"
        onClick={handleNavigateTranslation}
      >
        Translate now
      </button>
    </div>
  );
}
