import apiAuthRequest from '@/apiRequests/auth';
import { HttpError } from '@/lib/http';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const req = await request.json();
  const force = req.force as boolean | undefined;
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken');

  if (force) {
    return Response.json(
      {
        message: 'Đã đăng xuất',
      },
      {
        headers: {
          'Set-Cookie': `accessToken=; Path=/; HttpOnly; Max-Age=0`,
        },
      }
    );
  }

  if (!accessToken) {
    return Response.json(
      { message: 'không nhận được session token' },
      { status: 400 }
    );
  }

  try {
    const resultFromNextServer =
      await apiAuthRequest.logoutFromNextServerToServer(accessToken.value);
    return Response.json(resultFromNextServer, {
      headers: {
        'Set-Cookie': `accessToken=; Path=/; HttpOnly; Max-Age=0`,
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
