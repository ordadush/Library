import mongoose, { Schema, Document } from "mongoose";

export interface IConversation extends Document {
  messages: Array<string>;
  users: Array<string>;
  name: string;
}

const ConversationSchema: Schema = new Schema({
  messages: { type: Array, required: true },
  users: { type: Array, required: true },
  name: { type: String, required: true },
});

export default mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema
);
