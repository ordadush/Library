import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  time: number;
  deletedBy: Array<string>;
  description: string;
  sender: string;
  starredBy: Array<String>;
}

const MessageSchema: Schema = new Schema({
  time: { type: Number, required: true },
  deletedBy: { type: Array, required: true },
  starredBy: { type: Array, required: true },
  description: { type: String, required: true },
  sender: { type: String, required: true },
});

export default mongoose.model<IMessage>("Message", MessageSchema);
