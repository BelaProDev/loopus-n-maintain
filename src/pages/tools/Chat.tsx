import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Send, Hash, Users, Settings } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatMessage, ChatRoom, ChatUser } from '@/types/chat';
import { motion } from 'framer-motion';

const fetchMessages = async (roomId: string): Promise<ChatMessage[]> => {
  const response = await fetch('/.netlify/functions/chat-messages', {
    method: 'POST',
    body: JSON.stringify({ action: 'list', roomId })
  });
  if (!response.ok) throw new Error('Failed to fetch messages');
  const data = await response.json();
  return data.data.data;
};

const fetchRooms = async (): Promise<ChatRoom[]> => {
  const response = await fetch('/.netlify/functions/chat-rooms', {
    method: 'POST',
    body: JSON.stringify({ action: 'list' })
  });
  if (!response.ok) throw new Error('Failed to fetch rooms');
  const data = await response.json();
  return data.data.data;
};

const Chat = () => {
  const [nickname, setNickname] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [activeRoom, setActiveRoom] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rooms = [] } = useQuery({
    queryKey: ['chat-rooms'],
    queryFn: fetchRooms,
    refetchInterval: 5000
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['chat-messages', activeRoom],
    queryFn: () => fetchMessages(activeRoom),
    refetchInterval: 3000,
    enabled: !!activeRoom
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
      const response = await fetch('/.netlify/functions/chat-messages', {
        method: 'POST',
        body: JSON.stringify({
          action: 'create',
          data: message
        })
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', activeRoom] });
    }
  });

  useEffect(() => {
    const storedNickname = localStorage.getItem("irc-nickname");
    if (storedNickname) {
      setNickname(storedNickname);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSetNickname = (newNick: string) => {
    if (newNick.length < 3) {
      toast({
        title: "Invalid nickname",
        description: "Nickname must be at least 3 characters long",
        variant: "destructive"
      });
      return;
    }
    localStorage.setItem("irc-nickname", newNick);
    setNickname(newNick);
    toast({
      title: "Nickname set",
      description: `You are now known as ${newNick}`
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoom) return;

    sendMessageMutation.mutate({
      roomId: activeRoom,
      sender: nickname,
      content: newMessage,
      type: 'message'
    });

    setNewMessage("");
  };

  if (!nickname) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto p-6">
          <h2 className="text-xl font-mono mb-4">Welcome to IRC</h2>
          <div className="space-y-4">
            <Input
              placeholder="Choose your nickname..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSetNickname((e.target as HTMLInputElement).value);
                }
              }}
            />
            <Button 
              className="w-full font-mono"
              onClick={(e) => handleSetNickname((e.currentTarget.previousSibling as HTMLInputElement).value)}
            >
              Join IRC
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-6xl mx-auto">
        <div className="grid grid-cols-12 h-[80vh]">
          {/* Rooms List */}
          <div className="col-span-3 border-r border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="h-5 w-5 text-primary" />
              <h2 className="font-mono text-lg">Rooms</h2>
            </div>
            <ScrollArea className="h-[calc(100%-2rem)]">
              {rooms.map((room) => (
                <motion.button
                  key={room.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setActiveRoom(room.id)}
                  className={`w-full text-left p-2 rounded font-mono ${
                    activeRoom === room.id ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
                  }`}
                >
                  #{room.name}
                </motion.button>
              ))}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="col-span-9 flex flex-col">
            {activeRoom ? (
              <>
                {/* Room Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="h-5 w-5 text-primary" />
                      <h2 className="font-mono text-lg">
                        {rooms.find(r => r.id === activeRoom)?.name}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {rooms.find(r => r.id === activeRoom)?.users.length || 0} users
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 font-mono">
                    {rooms.find(r => r.id === activeRoom)?.topic}
                  </p>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  <div className="space-y-2">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`font-mono ${
                          message.type === 'system' ? 'text-gray-500 italic' :
                          message.type === 'bot' ? 'text-primary italic' :
                          message.sender === nickname ? 'text-primary' : ''
                        }`}
                      >
                        <span className="text-gray-400">
                          [{new Date(message.timestamp).toLocaleTimeString()}]
                        </span>{' '}
                        <span className="font-bold">{message.sender}:</span>{' '}
                        {message.content}
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="font-mono"
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 font-mono">
                Select a room to start chatting
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chat;