import apiTranslateRequest from '@/apiRequests/translate';
import TranslateForm from '@/app/translate/TranslateForm';
import { cookies } from 'next/headers';
import React from 'react';

export type TranslationLanguages = {
  translation: {
    [key: string]: {
      name: string;
      nativeName: string;
      dir: 'ltr' | 'rtl';
    };
  };
};

export default async function Translate() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const responseHistoryTranslation = await apiTranslateRequest.getTranslation(
    accessToken as string
  );

  const dataTranslations = responseHistoryTranslation.payload;

  const languagesEndpoint =
    'https://api.cognitive.microsofttranslator.com/languages?api-version=3.0';
  const response = await fetch(languagesEndpoint, {
    next: {
      revalidate: 60 * 60 * 24, // cache the result for 24 hours and then refresh
    },
  });

  const languages = (await response.json()) as TranslationLanguages;
  return (
    <div className="px-10 xl:px-0 mb-20">
      <TranslateForm
        languages={languages}
        dataTranslations={dataTranslations}
      />
    </div>
  );
}
