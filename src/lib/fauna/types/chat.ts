export interface ChatRoom {
  id: string;
  name: string;
  topic?: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  sender: string;
  content: string;
  timestamp: Date;
}