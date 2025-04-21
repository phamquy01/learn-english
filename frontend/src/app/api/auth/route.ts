import { decodeJwt } from '@/lib/utils';
import { redirect } from 'next/navigation';

type PayloadJwt = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
};

export async function POST(request: Request) {
  const res = await request.json();
  const accessToken = res.accessToken as string;

  if (!accessToken) {
    return Response.json(
      { message: 'không nhận được access token' },
      { status: 400 }
    );
  }

  const payload = decodeJwt<PayloadJwt>(accessToken);

  const expirsDate = new Date(payload.exp * 1000).toUTCString();

  return Response.json(res, {
    headers: {
      'Set-Cookie': `accessToken=${accessToken}; Path=/;Expires=${expirsDate} ;HttpOnly; SameSite=lax; Secure`,
    },
  });
}
