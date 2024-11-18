import { ChatRoom, ChatMessage } from '@/lib/fauna/types/chat';

export const chatService = {
  async listRooms(): Promise<ChatRoom[]> {
    const response = await fetch('/.netlify/functions/chat-rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'list' })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch rooms');
    }

    const result = await response.json();
    // Handle the nested data structure from Fauna
    return result.data.data.data.map((room: any) => ({
      id: room.id,
      name: room.name,
      topic: room.topic || '',
      createdAt: room.createdAt.isoString
    }));
  },

  async createRoom(name: string, topic?: string): Promise<ChatRoom> {
    const response = await fetch('/.netlify/functions/chat-rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create',
        data: { name, topic }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create room');
    }

    const result = await response.json();
    return result.data;
  },

  async listMessages(roomId: string): Promise<ChatMessage[]> {
    const response = await fetch('/.netlify/functions/chat-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'list',
        roomId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    const result = await response.json();
    return result.data || [];
  },

  async sendMessage(roomId: string, content: string, sender: string): Promise<ChatMessage> {
    const response = await fetch('/.netlify/functions/chat-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create',
        data: { roomId, content, sender }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }

    const result = await response.json();
    return result.data;
  }
};
