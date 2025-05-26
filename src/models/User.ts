import mongoose, { InferSchemaType, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Criação do schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  timestamps: true
});

// 2. Método de comparação de senha
UserSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 3. Tipagem do schema
export type UserType = InferSchemaType<typeof UserSchema> & {
  comparePassword(candidatePassword: string): Promise<boolean>;
};

// 4. Evita redefinir o model se já estiver carregado
const User = (mongoose.models.User as Model<UserType>) || mongoose.model<UserType>('User', UserSchema);

export default User;
