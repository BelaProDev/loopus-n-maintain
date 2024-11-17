export interface ChatRoom {
  id: string;
  name: string;
  topic?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  sender: string;
  content: string;
  timestamp: string;
}