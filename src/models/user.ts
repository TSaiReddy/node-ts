import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  role: string;
  email: string;
  password: string;
  last_name: string;
  first_name: string;
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  role: String,
  last_name: String,
  password: { minLength: 8, type: String },
  first_name: { type: String, required: true },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
