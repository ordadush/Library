import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  imageUrl: number;
  lastName: string;
  mobile: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
});

export default mongoose.model<IUser>("User", UserSchema);
