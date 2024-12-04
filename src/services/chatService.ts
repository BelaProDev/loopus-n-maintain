import type { ChatRoom, ChatMessage, ChatRoomDocument, ChatMessageDocument } from '@/lib/fauna/types/chat';
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
    return extractFaunaData<ChatRoom>(result);
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
    const rooms = extractFaunaData<ChatRoom>(result.data);
    return rooms[0];
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
    return extractFaunaData<ChatMessage>(result.data);
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
    const messages = extractFaunaData<ChatMessage>(result.data);
    return messages[0];
  }
};