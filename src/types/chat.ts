export interface ChatRoom {
  id: string;
  name: string;
  topic: string;
  createdAt: string;
  users: string[];
}

export interface ChatMessage {
  id: string;
  roomId: string;
  sender: string;
  content: string;
  type: 'message' | 'system' | 'bot';
  timestamp: string;
}

export interface ChatUser {
  nickname: string;
  joinedAt: string;
  activeRoom: string;
}