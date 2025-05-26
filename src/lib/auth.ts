import jwt from 'jsonwebtoken';

// Garantindo que SECRET será string
const SECRET = process.env.JWT_SECRET as string;
if (!SECRET) throw new Error("JWT_SECRET não está definido");

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { 
    algorithm: 'HS256', 
    expiresIn: '1h' 
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET, { algorithms: ['HS256'] });
}

// Versão para Edge (usando jose)
export async function verifyTokenEdge(token: string) {
  const { jwtVerify } = await import('jose');
  const secret = new TextEncoder().encode(SECRET); // Usando a constante SECRET
  
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
  });
  
  return payload;
}