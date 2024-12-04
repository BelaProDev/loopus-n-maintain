import type { FaunaDocument } from '@/types/fauna';

export interface ChatRoom {
  id: string;
  name: string;
  topic?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  createdAt: string;
  room: {
    id: string;
  };
}

export interface ChatRoomDocument extends FaunaDocument<Omit<ChatRoom, 'id'>> {}
export interface ChatMessageDocument extends FaunaDocument<Omit<ChatMessage, 'id'>> {}