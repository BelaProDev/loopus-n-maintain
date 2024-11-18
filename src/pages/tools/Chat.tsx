import { useState, useEffect, useRef } from "react";
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
  const [activeRoom, setActiveRoom] = useState("");
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ["chatRooms"],
    queryFn: async () => {
      const response = await fetch("/.netlify/functions/chat-rooms", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "list" })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch rooms');
      }
      
      const result = await response.json();
      return extractFaunaData(result) as ChatRoom[];
    },
    refetchInterval: 3000
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", activeRoom],
    queryFn: async () => {
      if (!activeRoom) return [];
      const response = await fetch("/.netlify/functions/chat-messages", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: "list", 
          roomId: activeRoom 
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch messages');
      }
      
      const result = await response.json();
      return result.data || [];
    },
    enabled: Boolean(activeRoom),
    refetchInterval: 1000,
    gcTime: 0
  });

  const createRoom = useMutation({
    mutationFn: async ({ name, topic }: { name: string; topic: string }) => {
      const response = await fetch("/.netlify/functions/chat-rooms", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: "create", 
          data: { name, topic } 
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create room');
      }
      
      return result.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      setActiveRoom(data.id);
      toast.success("Room created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const sendMessage = useMutation({
    mutationFn: async ({ content, nickname }: { content: string; nickname: string }) => {
      const response = await fetch("/.netlify/functions/chat-messages", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: "create",
          roomId: activeRoom,
          data: {
            content,
            sender: nickname
          }
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }
      
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", activeRoom] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleCreateRoom = (name: string, topic: string) => {
    createRoom.mutate({ name, topic });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)] bg-background rounded-lg border shadow-sm">
          <RoomsList
            rooms={rooms}
            activeRoom={activeRoom}
            onRoomSelect={setActiveRoom}
            onRefresh={() => queryClient.invalidateQueries({ queryKey: ["chatRooms"] })}
            onCreateRoom={handleCreateRoom}
            isLoading={roomsLoading}
          />
          <div className="col-span-9 flex flex-col">
            <ScrollArea 
              className="flex-1 p-4" 
              ref={scrollRef}
            >
              <MessageList 
                messages={messages} 
                isLoading={messagesLoading} 
              />
            </ScrollArea>
            <div className="p-4 border-t bg-background">
              <MessageInput 
                onSendMessage={(content, nickname) => sendMessage.mutate({ content, nickname })}
                isLoading={sendMessage.isPending}
                disabled={!activeRoom}
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