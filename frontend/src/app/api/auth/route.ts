import { decodeJwt } from '@/lib/utils';

type PayloadJwt = {
  sub: number;
  email: string;
  iat: number;
  exp: number;
};

export async function POST(request: Request) {
  const res = await request.json();
  const sessionToken = res.sessionToken as string;

  if (!sessionToken) {
    return Response.json(
      { message: 'không nhận được session token' },
      { status: 400 }
    );
  }

  const payload = decodeJwt<PayloadJwt>(sessionToken);

  const expirsDate = new Date(payload.exp * 1000).toUTCString();

  return Response.json(res, {
    headers: {
      'Set-Cookie': `sessionToken=${sessionToken}; Path=/; HttpOnly; Expires=${expirsDate}; SameSite=lax; Secure`,
    },
  });
}
