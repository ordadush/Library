export default interface Conversation {
  _id?: string;
  time: number;
  sender: string;
  description: string;
  deletedBy: string[];
  conversationID?: string;
  starredBy: string[];
}
