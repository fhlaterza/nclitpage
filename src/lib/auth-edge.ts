const SECRET = process.env.JWT_SECRET as string;
if (!SECRET) throw new Error("JWT_SECRET não está definido");

export async function verifyTokenEdge(token: string) {
  const { jwtVerify } = await import('jose');
  const secret = new TextEncoder().encode(SECRET);

  const { payload } = await jwtVerify(token, secret, {
    algorithms: ['HS256'],
  });

  return payload;
}
