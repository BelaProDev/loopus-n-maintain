import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoomsList from "./chat/RoomsList";
import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";
import type { ChatMessage, ChatRoom } from "@/types/chat";

const Chat = () => {
  const [activeRoom, setActiveRoom] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch chat rooms
  const { data: rooms = [], isLoading: roomsLoading } = useQuery<ChatRoom[]>({
    queryKey: ["chatRooms"],
    queryFn: async () => {
      const response = await fetch("/.netlify/functions/chat-rooms", {
        method: "POST",
        body: JSON.stringify({ action: "list" })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      const result = await response.json();
      return result.data;
    }
  });

  // Fetch messages for active room
  const { data: messages = [], isLoading: messagesLoading } = useQuery<ChatMessage[]>({
    queryKey: ["messages", activeRoom],
    queryFn: async () => {
      if (!activeRoom) return [];
      const response = await fetch("/.netlify/functions/chat-messages", {
        method: "POST",
        body: JSON.stringify({ action: "list", roomId: activeRoom })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const result = await response.json();
      return result.data;
    },
    enabled: Boolean(activeRoom)
  });

  // Create room mutation
  const createRoom = useMutation({
    mutationFn: async ({ name, topic }: { name: string; topic: string }) => {
      const response = await fetch("/.netlify/functions/chat-rooms", {
        method: "POST",
        body: JSON.stringify({ action: "create", data: { name, topic } })
      });
      if (!response.ok) {
        throw new Error('Failed to create room');
      }
      const result = await response.json();
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      toast({ title: "Success", description: "Room created successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch("/.netlify/functions/chat-messages", {
        method: "POST",
        body: JSON.stringify({
          action: "create",
          data: {
            roomId: activeRoom,
            content,
            sender: "User" // Replace with actual user info when auth is implemented
          }
        })
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      const result = await response.json();
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", activeRoom] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
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
            <ScrollArea className="flex-1 p-4">
              <MessageList messages={messages} isLoading={messagesLoading} />
            </ScrollArea>
            <Separator />
            <div className="p-4">
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