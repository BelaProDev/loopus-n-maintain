import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Send, Users } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

const fetchMessages = async (): Promise<Message[]> => {
  const response = await fetch('/.netlify/functions/chat-messages', {
    method: 'POST',
    body: JSON.stringify({ action: 'list' })
  });
  if (!response.ok) throw new Error('Failed to fetch messages');
  const data = await response.json();
  return data.data.data.map((msg: any) => ({
    id: msg.id,
    text: msg.text,
    sender: msg.sender,
    timestamp: new Date(msg.timestamp)
  }));
};

const createMessage = async (message: Omit<Message, 'id' | 'timestamp'>) => {
  const response = await fetch('/.netlify/functions/chat-messages', {
    method: 'POST',
    body: JSON.stringify({
      action: 'create',
      data: message
    })
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};

const Chat = () => {
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ['chat-messages'],
    queryFn: fetchMessages,
    refetchInterval: 3000, // Poll every 3 seconds
  });

  const mutation = useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const storedUsername = localStorage.getItem("chat-username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      const randomUsername = `User${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem("chat-username", randomUsername);
      setUsername(randomUsername);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    mutation.mutate({
      text: newMessage,
      sender: username
    });

    setNewMessage("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Chat Room</h1>
          </div>

          <ScrollArea className="h-[60vh] rounded-md border p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.sender === username ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {message.sender[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === username
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">{message.sender}</p>
                    <p>{message.text}</p>
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" disabled={mutation.isPending}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Chat;