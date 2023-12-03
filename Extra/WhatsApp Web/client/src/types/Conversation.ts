export default interface Conversation {
  _id: string;
  messages: string[];
  users: string[];
  name?: string;
}
