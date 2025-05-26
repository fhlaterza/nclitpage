import dotenv from "dotenv";
dotenv.config({ path: ".env" }); // 👈 vem ANTES de ler as variáveis

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) throw new Error("MONGODB_URI não está definida no .env");

export async function connectToDatabase() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGODB_URI);
}