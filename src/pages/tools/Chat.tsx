import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoomsList from "./chat/RoomsList";
import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";
import { ChatRoom, ChatMessage } from "@/types/chat";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Chat = () => {
  const [activeRoom, setActiveRoom] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch chat rooms
  const { data: rooms = [] } = useQuery<ChatRoom[]>({
    queryKey: ["chatRooms"],
    queryFn: async () => {
      const response = await fetch("/.netlify/functions/chat-rooms");
      const data = await response.json();
      return data.data || [];
    }
  });

  // Fetch messages for active room
  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ["messages", activeRoom],
    queryFn: async () => {
      if (!activeRoom) return [];
      const response = await fetch("/.netlify/functions/chat-messages", {
        method: "POST",
        body: JSON.stringify({ action: "list", roomId: activeRoom })
      });
      const data = await response.json();
      return data.data || [];
    },
    enabled: !!activeRoom
  });

  // Create new room mutation
  const createRoomMutation = useMutation({
    mutationFn: async ({ name, topic }: { name: string; topic: string }) => {
      const response = await fetch("/.netlify/functions/chat-rooms", {
        method: "POST",
        body: JSON.stringify({ 
          action: "create",
          data: { name, topic }
        })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      toast({
        title: "Success",
        description: "New room created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create room",
        variant: "destructive",
      });
    }
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      const response = await fetch("/.netlify/functions/chat-messages", {
        method: "POST",
        body: JSON.stringify({
          action: "create",
          data: {
            roomId: activeRoom,
            content,
            sender: "User", // Replace with actual user info when auth is implemented
            type: "message"
          }
        })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", activeRoom] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  });

  const handleRoomCreate = async (name: string, topic: string) => {
    await createRoomMutation.mutateAsync({ name, topic });
  };

  const handleSendMessage = async (content: string) => {
    if (!activeRoom) {
      toast({
        title: "Error",
        description: "Please select a room first",
        variant: "destructive",
      });
      return;
    }
    await sendMessageMutation.mutateAsync({ content });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-16rem)] bg-background rounded-lg border shadow-sm">
          <RoomsList
            rooms={rooms}
            activeRoom={activeRoom}
            onRoomSelect={setActiveRoom}
            onRoomCreate={handleRoomCreate}
          />
          <div className="col-span-9 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <MessageList messages={messages} />
            </ScrollArea>
            <Separator />
            <div className="p-4">
              <MessageInput onSendMessage={handleSendMessage} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;