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
    data: Array<{
      id: string;
      content: string;
      sender: string;
      createdAt: { isoString: string };
      room: {
        id: string;
      };
    }>;
  };
}

export interface FaunaRoomResponse {
  data: {
    data: Array<{
      id: string;
      name: string;
      topic?: string;
      createdAt: { isoString: string };
    }>;
  };
}