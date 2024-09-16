import http from '@/lib/http';
import { UserResType } from '@/schemaValidations/user.schema';

const apiCardRequests = {
  getDictionary: (param: string) =>
    http.get(`api/v2/entries/en/${param}`, {
      baseUrl: process.env.DICTIIONARY_API_ENDPOINT,
    }),
};

export default apiCardRequests;
