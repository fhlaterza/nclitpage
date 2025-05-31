import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  await connectToDatabase();

  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  }

  const token = signToken({ id: user._id, email: user.email });

  return NextResponse.json({ token }, { status: 200 });
}

export const config = {
  runtime: "nodejs",
};