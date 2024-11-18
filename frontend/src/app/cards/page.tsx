import Card from '@/app/cards/card';
import { cookies } from 'next/headers';
import React from 'react';

export default async function Cards() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken');
  return (
    <div className="flex justify-center flex-col items-center">
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
        Test your language skills!
      </h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Guess the English meaning before flipping the card
      </p>
      <Card accessToken={accessToken?.value || ''} />
    </div>
  );
}
