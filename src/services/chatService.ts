import { ChatRoom, ChatMessage } from '@/lib/fauna/types/chat';
import { extractFaunaData } from '@/lib/fauna/utils';

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
    return result.data.data || [];
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
    return result.data.data || [];
  },

  async sendMessage(roomId: string, content: string, sender: string): Promise<ChatMessage> {
    const response = await fetch('/.netlify/functions/chat-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create',
        roomId,
        data: { content, sender }
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