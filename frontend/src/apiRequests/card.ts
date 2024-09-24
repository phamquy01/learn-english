import http from '@/lib/http';
import { WordsResType } from '@/schemaValidations/card.schema';

const envDictionaryApiEndpoint =
  process.env.NEXT_PUBLIC_DICTIONARY_API_ENDPOINT!;

const apiCardRequests = {
  getDictionary: (param: string) =>
    http.get<any>(`${param}`, {
      baseUrl: envDictionaryApiEndpoint,
      headers: {
        'Content-type': 'application/json',
      },
    }),

  getWords: (current: number, pageSize?: number) =>
    http.get<WordsResType>(
      `/api/v1/words?current=${current}&pageSize=${pageSize}`
    ),
};

export default apiCardRequests;
