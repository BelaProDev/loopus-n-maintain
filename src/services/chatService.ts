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
    return extractFaunaData<ChatRoom>(result).map(doc => ({
      id: doc.ref.id,
      name: doc.data.name,
      topic: doc.data.topic || '',
      createdAt: doc.data.createdAt
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
    // Handle the triple-nested data structure
    return result.data.data.data.map((message: any) => ({
      id: message.id,
      content: message.content,
      sender: message.sender,
      createdAt: message.createdAt.isoString,
      room: {
        id: message.room.id
      }
    }));
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