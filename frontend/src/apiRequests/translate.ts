import translate from '@/actions/translate';
import http from '@/lib/http';
import {
  TranslationBodyType,
  TranslationListResType,
  TranslationResType,
} from '@/schemaValidations/translate.schema';
import { headers } from 'next/headers';
import { v4 } from 'uuid';

const key = process.env.AZURE_TEXT_TRANSLATION_KEY;
const endpoint = process.env.AZUE_TEXT_TRANSLATION;
const location = process.env.AZUE_TEXT_LOCATION;

const apiTranslateRequest = {
  translation: (accessToken: string, body: any) =>
    http.post<TranslationBodyType>('api/v1/translation', body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),

  getTranslation: (accessToken: string) =>
    http.get<TranslationListResType>('api/v1/translation', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        tags: ['translationHistory'],
      },
    }),

  deleteTranslation: (
    accessToken: string,
    userId: string,
    translationId: string
  ) =>
    http.delete<TranslationListResType>(
      `api/v1/translation/${userId}/${translationId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ),

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
