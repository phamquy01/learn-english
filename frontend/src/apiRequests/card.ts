import http from '@/lib/http';

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
};

export default apiCardRequests;
