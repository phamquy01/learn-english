import http from '@/lib/http';
import { UserResType } from '@/schemaValidations/user.schema';

const apiAccountRequests = {
  // get user to server
  me: (accessToken: string) =>
    http.get<UserResType>('api/v1/users', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),

  // get user to client
  meClient: () => http.get<UserResType>('api/v1/users'),
};

export default apiAccountRequests;
