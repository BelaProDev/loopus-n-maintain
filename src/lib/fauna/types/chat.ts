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
  room?: {
    id: string;
  };
}

export interface FaunaMessageResponse {
  data: {
    data: {
      data: ChatMessage[];
    };
  };
}

export interface FaunaRoomResponse {
  data: {
    data: ChatRoom[];
  };
}