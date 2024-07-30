import http from '@/lib/http';
import { AccountResType } from '@/schemaValidations/account.schema';

const apiUserRequests = {
  me: (sessionToken: string) =>
    http.get<AccountResType>('/user/me', {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),

  meClient: () => http.get<AccountResType>('/user/me'),
};

export default apiUserRequests;
