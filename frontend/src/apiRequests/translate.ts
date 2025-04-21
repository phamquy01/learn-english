import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
  SaveTranslationBodyType,
  TranslationBodyType,
  TranslationListResType,
  TranslationResType,
} from '@/schemaValidations/translate.schema';

const endpoint = process.env.MYMEMORY_ENDPOINT;
// const key = process.env.AZURE_TEXT_TRANSLATION_KEY;
// const location = process.env.AZUE_TEXT_LOCATION;

const apiTranslateRequest = {
  translation: (accessToken: string, body: any) =>
    http.post<TranslationBodyType>('api/v1/translation', body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),

  getTranslation: (accessToken?: string) =>
    http.get<TranslationListResType>('api/v1/translation', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        tags: ['translationHistory'],
      },
    }),

  saveTranslation: (body: SaveTranslationBodyType) =>
    http.post<MessageResType>('api/v1/translation/save-translation', body),

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
  // translate: (params: string, body: { input: string }) =>
  //   http.post<TranslationResType>(
  //     `/translate?${params}`,
  //     [
  //       {
  //         Text: body.input,
  //       },
  //     ],
  //     {
  //       baseUrl: endpoint,
  //       headers: {
  //         'Ocp-Apim-Subscription-Key': key!,
  //         'Ocp-Apim-Subscription-Region': location!,
  //         'Content-Type': 'application/json',
  //         'X-Client-Name': v4().toString(),
  //       },
  //     }
  //   ),

  // translate
  translate: (params: string) =>
    http.get<any>(`/get?${params}`, {
      baseUrl: endpoint,
      headers: {
        'Content-Type': 'application/json',
      },
    }),
};

export default apiTranslateRequest;
