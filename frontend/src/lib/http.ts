import envConfig from '@/config';
import { nomalizePath } from '@/lib/utils';
import { LoginResType } from '@/schemaValidations/auth.schema';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

type CustomOptions = RequestInit & {
  baseUrl?: string;
};

const ENTITI_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntititErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({ status, payload }: { status: number; payload: any }) {
    super('Http Error');
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: 422;
  payload: EntititErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntititErrorPayload;
  }) {
    super({ status, payload });
    if (status !== ENTITI_ERROR_STATUS) {
      throw new Error('EntitiError must have status 422');
    }
    this.status = status;
    this.payload = payload;
  }
}

class ClientAccessToken {
  private token = '';
  get value() {
    return this.token;
  }
  set value(token: string) {
    if (typeof window === 'undefined') {
      throw new Error('Cannot set token on server side');
    }
    this.token = token;
  }
}

export const clientAccessToken = new ClientAccessToken();
let clientLogoutRequest: null | Promise<any> = null;

const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options?: CustomOptions | undefined
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  const baseHeaders = {
    'Content-Type': 'application/json',
    Authorization: clientAccessToken.value
      ? `Bearer ${clientAccessToken.value}`
      : '',
  };
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = url.startsWith('/')
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  });

  const payload: Response = await res.json();

  const data = {
    status: res.status,
    payload,
  };

  if (!res.ok) {
    if (res.status === ENTITI_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntititErrorPayload;
        }
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (typeof window !== 'undefined') {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch('/api/auth/logout', {
            method: 'POST',
            body: JSON.stringify({ force: true }),
            headers: {
              ...baseHeaders,
            },
          });
          await clientLogoutRequest;
          clientAccessToken.value = '';
          location.href = '/login';
        }
      } else {
        const accessToken = (options?.headers as any)?.Authorization.split(
          'Bearer '
        )[1];
        redirect(`/logout?accessToken=${accessToken}`);
      }
    } else {
      throw new HttpError(data);
    }
  }

  if (typeof window !== 'undefined') {
    if (
      ['auth/login', 'auth/register'].some((item) => item === nomalizePath(url))
    ) {
      clientAccessToken.value = (payload as LoginResType).data.accessToken;
      console.log('AccessToken updated:', clientAccessToken.value);
    } else if ('auth/logout' === nomalizePath(url)) {
      clientAccessToken.value = '';
    }
  }
  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('GET', url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('POST', url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('PUT', url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('DELETE', url, options);
  },
};

export default http;
