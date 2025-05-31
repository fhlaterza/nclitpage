import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth-node";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Token não fornecido ou malformado" }, 
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token) as { id: string };
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    return NextResponse.json(
      { error: "Token inválido ou expirado" }, 
      { status: 401 }
    );
  }
}

export const config = {
  runtime: "nodejs",
};