import translate from '@/actions/translate';
import http from '@/lib/http';
import {
  TranslationBodyType,
  TranslationResType,
} from '@/schemaValidations/translate.schema';
import { v4 } from 'uuid';

const key = process.env.AZURE_TEXT_TRANSLATION_KEY;
const endpoint = process.env.AZUE_TEXT_TRANSLATION;
const location = process.env.AZUE_TEXT_LOCATION;

const apiTranslateRequest = {
  addOrUpdateTranslate: (accessToken: string, translate: TranslationBodyType) =>
    http.post<TranslationResType>('/translation', translate, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),

  // translate
  translate: (params: string, body: { input: string }) =>
    http.post<TranslationResType>(
      `/translate?${params}`,
      [
        {
          Text: body.input,
        },
      ],
      {
        baseUrl: endpoint,
        headers: {
          'Ocp-Apim-Subscription-Key': key!,
          'Ocp-Apim-Subscription-Region': location!,
          'Content-Type': 'application/json',
          'X-Client-Name': v4().toString(),
        },
      }
    ),
};

export default apiTranslateRequest;
