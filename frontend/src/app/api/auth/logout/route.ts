import apiAuthRequest from '@/apiRequests/auth';
import { HttpError } from '@/lib/http';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('sessionToken');

  if (!sessionToken) {
    return Response.json(
      { message: 'không nhận được session token' },
      { status: 400 }
    );
  }

  try {
    const resultFromNextServer =
      await apiAuthRequest.logoutFromNextServerToServer(sessionToken.value);
    return Response.json(resultFromNextServer, {
      headers: {
        'Set-Cookie': `sessionToken=; Path=/; HttpOnly; Max-Age=0`,
      },
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(
        { message: error.message },
        { status: error.status }
      );
    }
  }
}
