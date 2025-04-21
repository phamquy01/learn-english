import http from '@/lib/http';
import {
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  RegisterResType,
  VerifyCodeBodyType,
} from '@/schemaValidations/auth.schema';
import { MessageResType } from '@/schemaValidations/common.schema';
import { ResendEmailResType } from '@/schemaValidations/user.schema';

const apiAuthRequest = {
  login: (body: LoginBodyType) =>
    http.post<LoginResType>('api/v1/auth/login', body, {}),

  register: (body: RegisterBodyType) =>
    http.post<RegisterResType>('api/v1/auth/register', body, {}),

  auth: (body: { accessToken: string }) =>
    http.post<{ accessToken: string }>('/api/auth', body, {
      baseUrl: '',
    }),

  checkCode: (body: VerifyCodeBodyType) =>
    http.post<MessageResType>('/api/v1/auth/check-code', body),

  logoutFromNextServerToServer: (accessToken: string) =>
    http.post('/api/v1/auth/logout', null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

  resendEmail: (body: { email: string }) =>
    http.post<ResendEmailResType>('/api/v1/auth/resend-code', body),
};

export default apiAuthRequest;
