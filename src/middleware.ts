import { NextRequest, NextResponse } from "next/server";
import { verifyTokenEdge } from "@/lib/auth-edge";

const protectedRoutes = ["/api/me"];

function getClientIp(request: NextRequest): string {
  // Tentamos obter o IP de headers comuns usados por proxies/reverse proxies
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const forwarded = request.headers.get('forwarded');
  
  // Em desenvolvimento/localhost, mostraremos um identificador especial
  if (process.env.NODE_ENV === 'development') {
    return `dev-localhost`;
  }

  // Extrai o primeiro IP da lista se x-forwarded-for contiver múltiplos IPs
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  if (forwarded) {
    const match = forwarded.match(/for=([^;]+)/);
    if (match) {
      return match[1];
    }
  }

  // Fallback para conexão direta
  return request.headers.get('host') || 'unknown-ip';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  
  if (!authHeader) {
    return jsonError("Token ausente");
  }
  
  if (!authHeader.startsWith("Bearer ")) {
    return jsonError("Token malformado");
  }

  const token = authHeader.split(" ")[1].trim();
  
  if (!token) {
    return jsonError("Token vazio");
  }

  try {
    await verifyTokenEdge(token);
    return NextResponse.next();
  } catch (err) {
    const error = err as Error;
    const clientIp = getClientIp(request);
    
    const logData = {
      path: pathname,
      ip: clientIp,
      errorType: error.name,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || 'unknown'
    };

    console.warn("⚠️ Falha na autenticação:", JSON.stringify(logData, null, 2));

    return jsonError("Token inválido ou expirado");
  }
}

function jsonError(message: string): NextResponse {
  return new NextResponse(
    JSON.stringify({ error: message }),
    { status: 401, headers: { "Content-Type": "application/json" } }
  );
}