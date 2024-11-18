import { ChatMessage, ChatRoom, FaunaMessageResponse, FaunaRoomResponse } from '@/lib/fauna/types/chat';

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

    const result = (await response.json()) as FaunaRoomResponse;
    return result.data.data.map(room => ({
      id: room.id,
      name: room.name,
      topic: room.topic,
      createdAt: room.createdAt.isoString
    }));
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

    const result = (await response.json()) as FaunaMessageResponse;
    return result.data.data.map(message => ({
      id: message.id,
      content: message.content,
      sender: message.sender,
      createdAt: message.createdAt.isoString,
      room: message.room
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
      throw new Error('Failed to send message');
    }

    const result = await response.json();
    return result.data;
  }
};