'use server';

import { State } from '@/app/translate/TranslateForm';
import { v4 } from 'uuid';
import axios from 'axios';

const key = process.env.AZURE_TEXT_TRANSLATION_KEY;
const endpoint = process.env.AZUE_TEXT_TRANSLATION;
const location = process.env.AZUE_TEXT_LOCATION;
const AUTHENTICATION_ERROR_STATUS = 401;

async function translate(prevState: State, formData: FormData) {
  const rawData = {
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
      from: rawData.inputLanguage === 'auto' ? null : rawData.inputLanguage,
      to: rawData.outputLanguage,
    },
    data: [
      {
        text: rawData.input,
      },
    ],
    responseType: 'json',
  });

  const data = response.data;

  if (data.error) {
    console.log(`Error: ${data.error.code}: ${data.error.message}`);
  }

  // push to DB

  return {
    ...prevState,
    output: data[0].translations[0].text,
  };
}

export default translate;
