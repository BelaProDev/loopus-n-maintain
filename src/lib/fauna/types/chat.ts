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

export interface ContactMessage {
  id: string;
  service: 'electrics' | 'plumbing' | 'ironwork' | 'woodwork' | 'architecture';
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  createdAt: string;
}