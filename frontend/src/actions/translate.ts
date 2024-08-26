'use server';

import { State } from '@/app/translate/TranslateForm';
import { v4 } from 'uuid';
import axios from 'axios';
import apiTranslateRequest from '@/apiRequests/translate';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';

const key = process.env.AZURE_TEXT_TRANSLATION_KEY;
const endpoint = process.env.AZUE_TEXT_TRANSLATION;
const location = process.env.AZUE_TEXT_LOCATION;

async function translate(prevState: State, formData: FormData) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('Unauthorized'); // Không có token, trả về lỗi
  }

  try {
    jwt.verify(accessToken, process.env.JWT_SECRET!); // Kiểm tra tính hợp lệ của token
  } catch (error) {
    redirect(`/logout?accessToken=${accessToken}`);
  }

  const rawFromData = {
    input: formData.get('input') as string,
    inputLanguage: formData.get('inputLanguage') as string,
    output: formData.get('output') as string,
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

  // push to DB

  if (rawFromData.inputLanguage === 'auto') {
    rawFromData.inputLanguage = data[0].detectedLanguage.language;
  }

  try {
    const translation = {
      to: rawFromData.outputLanguage,
      from: rawFromData.inputLanguage,
      fromText: rawFromData.input,
      toText: data[0].translations[0].text,
    };

    // const result = await apiTranslateRequest.addOrUpdateTranslate(
    //   accessToken?.value ?? '',
    //   translation
    // );
  } catch (error) {
    console.error(
      'Error adding translation to user: ',
      (error as Error).message
    );
  }

  return {
    ...prevState,
    output: data[0].translations[0].text,
  };
}

export default translate;
