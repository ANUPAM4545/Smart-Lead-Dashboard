import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
  ADMIN = 'Admin',
  SALES = 'Sales User',
}

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: false },
    googleId: { type: String, required: false },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.SALES },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
