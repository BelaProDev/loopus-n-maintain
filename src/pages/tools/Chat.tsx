import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoomsList from "./chat/RoomsList";
import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";
import type { ChatMessage, ChatRoom } from "@/types/chat";

const Chat = () => {
  const [activeRoom, setActiveRoom] = useState("");
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch chat rooms
  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ["chatRooms"],
    queryFn: async () => {
      const response = await fetch("/.netlify/functions/chat-rooms", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "list" })
      });
      const result = await response.json();
      return result.data || [];
    },
    refetchInterval: 3000
  });

  // Fetch messages for active room
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", activeRoom],
    queryFn: async () => {
      if (!activeRoom) return [];
      const response = await fetch("/.netlify/functions/chat-messages", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "list", roomId: activeRoom })
      });
      const result = await response.json();
      return result.data || [];
    },
    enabled: Boolean(activeRoom),
    refetchInterval: activeRoom ? 3000 : false
  });

  // Create room mutation
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
      if (!response.ok) throw new Error(result.error || 'Failed to create room');
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

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch("/.netlify/functions/chat-messages", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: "create",
          data: {
            roomId: activeRoom,
            content,
            sender: "User" // Replace with actual user info when auth is implemented
          }
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to send message');
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", activeRoom] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-16rem)] bg-background rounded-lg border shadow-sm">
          <RoomsList
            rooms={rooms}
            activeRoom={activeRoom}
            onRoomSelect={setActiveRoom}
            onCreateRoom={(name, topic) => createRoom.mutate({ name, topic })}
            isLoading={roomsLoading}
          />
          <div className="col-span-9 flex flex-col">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <MessageList 
                messages={messages} 
                isLoading={messagesLoading} 
              />
            </ScrollArea>
            <div className="p-4 border-t">
              <MessageInput 
                onSendMessage={(content) => sendMessage.mutate(content)}
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