import React, { useRef } from 'react';
import Card from '@/app/cards/card';
import { cookies } from 'next/headers';
import apiTranslateRequest from '@/apiRequests/translate';

export default async function Page() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const responseHistoryTranslation = await apiTranslateRequest.getTranslation(
    accessToken as string
  );

  const dataTranslations = responseHistoryTranslation.payload;

  return (
    <div className="flex justify-center flex-col items-center">
      <h1 className="mb-5">Flat Card</h1>
      <Card dataTranslations={dataTranslations} />
    </div>
  );
}
