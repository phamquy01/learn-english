import http from '@/lib/http';
import {
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  RegisterResType,
} from '@/schemaValidations/auth.schema';

const apiAuthRequest = {
  login: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body),
  register: (body: RegisterBodyType) =>
    http.post<RegisterResType>('/auth/register', body),
  auth: (body: { sessionToken: string }) =>
    http.post<{ sessionToken: string }>('/api/auth', body, {
      baseUrl: '',
    }),

  logoutFromNextServerToServer: (sessionToken: string) =>
    http.post('/auth/logout', null, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),

  logoutFromNextClientToServer: (
    force?: boolean | undefined,
    signal?: AbortSignal | undefined
  ) =>
    http.post(
      '/api/auth/logout',
      {
        force,
      },
      {
        baseUrl: '',
        signal,
      }
    ),
};

export default apiAuthRequest;
