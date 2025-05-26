// scripts/createUser.ts
console.log("🚀 O script começou a rodar mesmo?");
import fs from "fs";
console.log("arquivo .env existe?", fs.existsSync(".env")); //
//  👈 ajuda no debug
import dotenv from "dotenv";
dotenv.config(); // 👈 importante!

console.log("MONGODB_URI carregado:", process.env.MONGODB_URI); // 👈 ajuda no debug

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User";
import { connectToDatabase } from "../src/lib/db";


async function createUser() {
  await connectToDatabase();

  const email = "admin@nclit.com.br";
  const plainPassword = "123456";

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  console.log("Usuário criado:", user);
  await mongoose.disconnect();
  process.exit(0);
}

createUser().catch((err) => {
  console.error(err);
  process.exit(1);
});
