import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET as string;
if (!SECRET) throw new Error("JWT_SECRET não está definido");

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET, { algorithms: ['HS256'] });
}
