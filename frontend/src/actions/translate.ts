'use server';

import { State } from '@/app/translate/TranslateForm';
import { v4 } from 'uuid';
import axios from 'axios';
import apiTranslateRequest from '@/apiRequests/translate';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { useFormStatus } from 'react-dom';

async function translate(prevState: State, formData: FormData) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('Unauthorized');
  }

  try {
    jwt.verify(accessToken, process.env.JWT_SECRET!);
  } catch (error) {
    redirect(`/logout?accessToken=${accessToken}`);
  }

  const rawFromData = {
    output: formData.get('output') as string,
    input: formData.get('input') as string,
    inputLanguage: formData.get('inputLanguage') as string,
    outputLanguage: formData.get('outputLanguage') as string,
  };

  const params = new URLSearchParams({
    'api-version': '3.0',
    from: rawFromData.inputLanguage === 'auto' ? '' : rawFromData.inputLanguage,
    to: rawFromData.outputLanguage,
  });

  const response = await apiTranslateRequest.translate(
    params.toString(),
    rawFromData
  );

  const data = response.payload;

  console.log('data', data);

  if (rawFromData.inputLanguage === 'auto') {
    rawFromData.inputLanguage = data[0].detectedLanguage.language;
  }

  try {
    const translationData = {
      to: rawFromData.outputLanguage,
      from: rawFromData.inputLanguage,
      fromText: rawFromData.input,
      toText: data[0].translations[0].text,
    };

    await apiTranslateRequest.translation(accessToken, translationData);
  } catch (error) {
    console.error(
      'Error adding translation to user: ',
      (error as Error).message
    );
  }

  revalidateTag('translationHistory');

  return {
    ...prevState,
    output: data[0].translations[0].text,
  };
}

export default translate;
