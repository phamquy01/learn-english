'use server';

import apiTranslateRequest from '@/apiRequests/translate';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { State } from '@/app/translate/TranslateForm';

async function translate(prevState: State, formData: FormData) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;


  if (!accessToken) {
    throw new Error('Unauthorized');
  }


  // try {
  //   jwt.verify(accessToken, process.env.JWT_SECRET!);
  // } catch (error) {
  //   redirect(`/logout?accessToken=${accessToken}`);
  // }

  const rawFromData = {
    output: formData.get('output') as string,
    input: formData.get('input') as string,
    inputLanguage: formData.get('inputLanguage') as string,
    outputLanguage: formData.get('outputLanguage') as string,
  };

  const params = new URLSearchParams({
    q: rawFromData.input ?? '',
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

  const getBestTranslation = (data: any) => {
    const matches = data.matches;

    const validatedMatches = matches.filter(
      (match: any) => match.translation !== '[object HTMLTextAreaElement]'
    );

    const highestQuality = Math.max(
      ...validatedMatches.map((match: any) => match.quality)
    );

    const bestMatches = validatedMatches.filter(
      (m: any) => m.quality === highestQuality
    );

    if (bestMatches.length === 1) {
      return bestMatches[0].translation;
    }

    const bestByUsage = bestMatches.sort(
      (a: any, b: any) => b['usage-count'] - a['usage-count']
    );

    bestByUsage.sort(
      (a: any, b: any) =>
        new Date(b['create-date']).getTime() -
        new Date(a['create-date']).getTime()
    );

    return bestByUsage[0]?.translation || data.responseData.translatedText;
  };

  try {
    const translationData = {
      to: rawFromData.outputLanguage,
      from: rawFromData.inputLanguage,
      fromText: rawFromData.input,
      toText:
        rawFromData.input === ''
          ? ''
          : getBestTranslation(data)
          ? getBestTranslation(data)
          : '',
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
    output:
      rawFromData.input === ''
        ? ''
        : getBestTranslation(data)
        ? getBestTranslation(data)
        : '',
  };
}

export default translate;
