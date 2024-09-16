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
  // login
  login: (body: LoginBodyType) =>
    http.post<LoginResType>('api/v1/auth/login', body),

  // register
  register: (body: RegisterBodyType) =>
    http.post<RegisterResType>('api/v1/auth/register', body),

  // register
  auth: (body: { accessToken: string }) =>
    http.post<{ accessToken: string }>('/api/auth', body, {
      baseUrl: '',
    }),

  // checkCode
  checkCode: (body: VerifyCodeBodyType) =>
    http.post<MessageResType>('/api/v1/auth/check-code', body),

  // lout out from next server to server
  logoutFromNextServerToServer: (accessToken: string) =>
    http.post('/api/v1/auth/logout', null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),

  // logout from next client to server
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

  // resend email
  resendEmail: (body: { email: string }) =>
    http.post<ResendEmailResType>('/api/v1/auth/resend-code', body),
};

export default apiAuthRequest;
