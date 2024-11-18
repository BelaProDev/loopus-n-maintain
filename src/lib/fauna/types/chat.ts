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
  room?: {
    id: string;
  };
}

export interface FaunaMessageResponse {
  data: {
    data: ChatMessage[];
  };
}

export interface FaunaRoomResponse {
  data: {
    data: ChatRoom[];
  };
}