import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoomsList from "./chat/RoomsList";
import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";
import { extractFaunaData } from "@/lib/fauna/utils";
import type { ChatMessage, ChatRoom } from "@/lib/fauna/types/chat";

const Chat = () => {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const response = await fetch('/api/chat/rooms');
      return extractFaunaData<ChatRoom[]>(response);
    },
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', activeRoom],
    queryFn: async () => {
      if (!activeRoom) return [];
      const response = await fetch(`/api/chat/rooms/${activeRoom}/messages`);
      return extractFaunaData<ChatMessage[]>(response);
    },
    enabled: !!activeRoom,
  });

  const createRoom = useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch('/api/chat/rooms', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error('Failed to create room');
      toast.success('Room created!');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  const sendMessage = useMutation({
    mutationFn: async ({ content, nickname }: { content: string; nickname: string }) => {
      const response = await fetch(`/api/chat/rooms/${activeRoom}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content, nickname }),
      });
      if (!response.ok) throw new Error('Failed to send message');
    },
    onSuccess: () => {
      toast.success('Message sent!');
    },
  });

  const handleRoomSelect = (roomId: string) => {
    setActiveRoom(roomId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 mb-20">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)] bg-background rounded-lg border shadow-sm">
          <RoomsList
            rooms={rooms.map(room => ({
              id: room.ref.id,
              name: room.data.name,
              lastMessage: room.data.lastMessage
            }))}
            activeRoom={activeRoom}
            onRoomSelect={handleRoomSelect}
            onCreateRoom={(name) => createRoom.mutate(name)}
            isLoading={roomsLoading}
          />
          
          <div className="col-span-9 flex flex-col">
            <ScrollArea className="flex-1">
              <MessageList
                messages={messages.map(msg => ({
                  id: msg.ref.id,
                  content: msg.data.content,
                  nickname: msg.data.nickname,
                  timestamp: msg.data.timestamp
                }))}
                isLoading={messagesLoading} 
              />
            </ScrollArea>
            <div className="p-4 border-t bg-background">
              <MessageInput 
                onSendMessage={(content, nickname) => sendMessage.mutate({ content, nickname })}
                isLoading={sendMessage.isPending}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
