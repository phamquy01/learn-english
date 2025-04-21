import http from '@/lib/http';
import { WordsResType } from '@/schemaValidations/card.schema';

const envDictionaryApiEndpoint =
  process.env.NEXT_PUBLIC_DICTIONARY_API_ENDPOINT!;

const envUnsplashApiEndpoint = process.env.NEXT_PUBLIC_UNSPLASH_API_ENDPOINT!;

const keyUnsplash = process.env.NEXT_PUBLIC_ACCESS_KEY!;

const apiCardRequests = {
  getDictionary: (param: string) =>
    http.get<any>(`${param}`, {
      baseUrl: envDictionaryApiEndpoint,
      headers: {
        'Content-type': 'application/json',
      },
    }),

  getWords: (accessToken: string, current?: number, pageSize?: number) =>
    http.get<WordsResType>(
      `/api/v1/words?current=${current}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ),

  getImageCard: (param: string) =>
    http.get<any>(`?${param}&client_id=${keyUnsplash}`, {
      baseUrl: envUnsplashApiEndpoint,
    }),
};

export default apiCardRequests;
