export async function POST(request: Request) {
  const res = await request.json();
  console.log(res);

  const sessionToken = res.sessionToken as string;

  if (!sessionToken) {
    return Response.json(
      { message: 'không nhận được session token' },
      { status: 400 }
    );
  }
  return Response.json(res, {
    headers: {
      'Set-Cookie': `sessionToken=${sessionToken}; Path=/; HttpOnly;`,
    },
  });
}
