import Link from 'next/link';
import React from 'react';

export default function Hompage() {
  return (
    <div className="px-10 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-center my-20">
        Welcome to Translate
      </h1>
      <Link href="/translate">
        <button className="w-[200px] h-[50px] border-solid border-2 border-indigo-600 rounded-md bg-indigo-600 text-[#fff]">
          Translate now
        </button>
      </Link>
    </div>
  );
}
