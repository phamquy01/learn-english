'use server';

import { State } from '@/app/translate/TranslateForm';
import { v4 } from 'uuid';
import axios from 'axios';
import apiTranslateRequest from '@/apiRequests/translate';
import { cookies } from 'next/headers';

const key = process.env.AZURE_TEXT_TRANSLATION_KEY;
const endpoint = process.env.AZUE_TEXT_TRANSLATION;
const location = process.env.AZUE_TEXT_LOCATION;

async function translate(prevState: State, formData: FormData) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('sessionToken');

  const rawFromData = {
    input: formData.get('input') as string,
    inputLanguage: formData.get('inputLanguage') as string,
    output: formData.get('output') as string,
    outputLanguage: formData.get('outputLanguage') as string,
  };

  const response = await axios({
    baseURL: endpoint,
    url: '/translate',
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key!,
      'Ocp-Apim-Subscription-Region': location!,
      'Content-Type': 'application/json',
      'X-Client-Name': v4().toString(),
    },
    params: {
      'api-version': '3.0',
      from:
        rawFromData.inputLanguage === 'auto' ? null : rawFromData.inputLanguage,
      to: rawFromData.outputLanguage,
    },
    data: [
      {
        text: rawFromData.input,
      },
    ],
    responseType: 'json',
  });

  const data = response.data;

  if (data.error) {
    console.log(`Error: ${data.error.code}: ${data.error.message}`);
  }

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

    const result = await apiTranslateRequest.addOrUpdateTranslate(
      sessionToken?.value ?? '',
      translation
    );
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
