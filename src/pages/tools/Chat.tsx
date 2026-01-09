import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, Plus, Send, Users, Hash, Settings,
  ArrowLeft, Search, Smile, Paperclip, Phone, Video,
  MoreVertical, Check, CheckCheck, Loader2
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Message {
  id: string;
  content: string;
  user_id: string;
  room_id: string;
  is_read: boolean;
  created_at: string;
  profiles?: {
    id: string;
    display_name: string | null;
    email: string | null;
  } | null;
}

interface Room {
  id: string;
  name: string;
  topic: string | null;
  created_by: string | null;
  is_private: boolean;
  created_at: string;
}

const Chat = () => {
  const { t } = useTranslation(["tools"]);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomTopic, setNewRoomTopic] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const nickname = user?.email?.split('@')[0] || "Guest";

  // Fetch rooms
  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ['chat-rooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Room[];
    },
    enabled: !!user,
  });

  // Fetch messages for selected room
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['chat-messages', selectedRoom?.id],
    queryFn: async () => {
      if (!selectedRoom) return [];
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', selectedRoom.id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      
      // Fetch profiles for message senders
      const userIds = [...new Set(data.map(m => m.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, email')
        .in('id', userIds);
      
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      return data.map(message => ({
        ...message,
        profiles: profileMap.get(message.user_id) || null,
      })) as Message[];
    },
    enabled: !!selectedRoom && !!user,
  });

  // Create room mutation
  const createRoomMutation = useMutation({
    mutationFn: async ({ name, topic }: { name: string; topic: string }) => {
      const { data, error } = await supabase
        .from('chat_rooms')
        .insert({
          name,
          topic: topic || null,
          created_by: user?.id,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-rooms'] });
      toast.success("Channel created successfully");
      setNewRoomName("");
      setNewRoomTopic("");
      setIsCreateRoomOpen(false);
    },
    onError: () => toast.error("Failed to create channel"),
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, roomId }: { content: string; roomId: string }) => {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          content,
          room_id: roomId,
          user_id: user?.id,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', selectedRoom?.id] });
    },
    onError: () => toast.error("Failed to send message"),
  });

  // Real-time subscription for messages
  useEffect(() => {
    if (!selectedRoom) return;

    const channel = supabase
      .channel(`room-${selectedRoom.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${selectedRoom.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['chat-messages', selectedRoom.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedRoom, queryClient]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRoom) return;
    sendMessageMutation.mutate({ content: newMessage, roomId: selectedRoom.id });
    setNewMessage("");
  };

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) {
      toast.error("Channel name is required");
      return;
    }
    createRoomMutation.mutate({ name: newRoomName, topic: newRoomTopic });
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.topic?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSenderName = (message: Message) => {
    if (message.profiles?.display_name) return message.profiles.display_name;
    if (message.profiles?.email) return message.profiles.email.split('@')[0];
    return 'Unknown';
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/tools">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Community Hub</h1>
        </div>
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-4">
              Please log in to access chat rooms and start messaging.
            </p>
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-4rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/tools">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-primary" />
              Community Hub
            </h1>
            <p className="text-muted-foreground">Real-time messaging and collaboration</p>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex gap-4 min-h-0">
          {/* Sidebar */}
          <Card className="w-80 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Channels</CardTitle>
                <Dialog open={isCreateRoomOpen} onOpenChange={setIsCreateRoomOpen}>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Channel</DialogTitle>
                      <DialogDescription>
                        Create a new chat channel for your team.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Channel Name</Label>
                        <Input
                          placeholder="e.g., project-updates"
                          value={newRoomName}
                          onChange={(e) => setNewRoomName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Topic (optional)</Label>
                        <Input
                          placeholder="What's this channel about?"
                          value={newRoomTopic}
                          onChange={(e) => setNewRoomTopic(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateRoomOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreateRoom} disabled={createRoomMutation.isPending}>
                        {createRoomMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Create Channel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search channels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-2 space-y-1">
                  {roomsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : filteredRooms.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Hash className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No channels yet</p>
                      <p className="text-sm">Create one to get started!</p>
                    </div>
                  ) : (
                    filteredRooms.map((room) => (
                      <motion.button
                        key={room.id}
                        whileHover={{ x: 4 }}
                        onClick={() => setSelectedRoom(room)}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          selectedRoom?.id === room.id 
                            ? 'bg-primary/10 border border-primary/20' 
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                              <Hash className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium truncate">{room.name}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {room.topic || "No topic set"}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="flex-1 flex flex-col">
            {selectedRoom ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <Hash className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{selectedRoom.name}</CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          {selectedRoom.topic || "No topic set"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-4 overflow-hidden">
                  <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                      {messagesLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No messages yet</p>
                          <p className="text-sm">Be the first to say hello!</p>
                        </div>
                      ) : (
                        <AnimatePresence>
                          {messages.map((message) => {
                            const isOwnMessage = message.user_id === user?.id;
                            return (
                              <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                              >
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs">
                                    {getSenderName(message)[0].toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : ''}`}>
                                  <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'justify-end' : ''}`}>
                                    <span className="text-sm font-medium">{getSenderName(message)}</span>
                                    <span className="text-xs text-muted-foreground">{formatTime(message.created_at)}</span>
                                  </div>
                                  <div className={`p-3 rounded-2xl ${
                                    isOwnMessage 
                                      ? 'bg-primary text-primary-foreground rounded-br-md' 
                                      : 'bg-muted rounded-bl-md'
                                  }`}>
                                    <p className="text-sm">{message.content}</p>
                                  </div>
                                  {isOwnMessage && (
                                    <div className="flex justify-end mt-1">
                                      {message.is_read ? (
                                        <CheckCheck className="h-4 w-4 text-primary" />
                                      ) : (
                                        <Check className="h-4 w-4 text-muted-foreground" />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2 items-center">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder={`Message #${selectedRoom.name}`}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!newMessage.trim() || sendMessageMutation.isPending}
                    >
                      {sendMessageMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a channel</h3>
                  <p className="text-muted-foreground">
                    Choose a channel from the sidebar to start chatting
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Chat;