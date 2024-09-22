'use server';

import { State } from '@/app/translate/TranslateForm';
import apiTranslateRequest from '@/apiRequests/translate';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';

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
    q: rawFromData.input,
    langpair: `${rawFromData.inputLanguage}|${rawFromData.outputLanguage}`,
  });

  if (rawFromData.inputLanguage === rawFromData.outputLanguage) {
    return {
      ...prevState,
      output: rawFromData.input,
    };
  }
  const response = await apiTranslateRequest.translate(params.toString());
  const data = response.payload;

  try {
    const translationData = {
      to: rawFromData.outputLanguage,
      from: rawFromData.inputLanguage,
      fromText: rawFromData.input,
      toText: data.matches ? data.matches[1]?.translation : '',
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
    output: data.matches ? data.matches[1]?.translation : '',
  };
}

export default translate;
