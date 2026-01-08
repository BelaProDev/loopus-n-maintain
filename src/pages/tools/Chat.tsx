import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, Plus, Send, Users, Hash, Settings,
  ArrowLeft, Search, Smile, Paperclip, Phone, Video,
  MoreVertical, Check, CheckCheck
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

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  read: boolean;
}

interface Room {
  id: string;
  name: string;
  topic?: string;
  lastMessage?: string;
  unreadCount: number;
  members: number;
  isOnline?: boolean;
}

const Chat = () => {
  const { t } = useTranslation(["tools"]);
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([
    { id: "1", name: "General", topic: "General discussion", lastMessage: "Hey everyone!", unreadCount: 3, members: 12, isOnline: true },
    { id: "2", name: "Random", topic: "Off-topic chat", lastMessage: "Anyone seen the latest...", unreadCount: 0, members: 8, isOnline: true },
    { id: "3", name: "Support", topic: "Help & support", lastMessage: "Thanks for the help!", unreadCount: 1, members: 5 },
    { id: "4", name: "Announcements", topic: "Important updates", lastMessage: "New feature released!", unreadCount: 0, members: 25 },
  ]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomTopic, setNewRoomTopic] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const nickname = user?.email?.split('@')[0] || "Guest";

  useEffect(() => {
    if (selectedRoom) {
      // Simulate loading messages for demo
      setMessages([
        { id: "1", content: "Welcome to the chat room!", sender: "System", timestamp: new Date(Date.now() - 3600000), read: true },
        { id: "2", content: "Hey everyone, how's it going?", sender: "Alice", timestamp: new Date(Date.now() - 1800000), read: true },
        { id: "3", content: "Pretty good! Working on some new features.", sender: "Bob", timestamp: new Date(Date.now() - 900000), read: true },
        { id: "4", content: "Nice! Can't wait to see them.", sender: "Alice", timestamp: new Date(Date.now() - 300000), read: true },
      ]);
    }
  }, [selectedRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRoom) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: nickname,
      timestamp: new Date(),
      read: false,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Update last message in room
    setRooms(prev => prev.map(room => 
      room.id === selectedRoom.id 
        ? { ...room, lastMessage: newMessage }
        : room
    ));
  };

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) {
      toast.error("Room name is required");
      return;
    }

    const newRoom: Room = {
      id: Date.now().toString(),
      name: newRoomName,
      topic: newRoomTopic,
      unreadCount: 0,
      members: 1,
      isOnline: true,
    };

    setRooms(prev => [...prev, newRoom]);
    setNewRoomName("");
    setNewRoomTopic("");
    setIsCreateRoomOpen(false);
    toast.success("Room created successfully");
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.topic?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
          <h1 className="text-3xl font-bold">Chat</h1>
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
              Chat Rooms
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
                      <Button onClick={handleCreateRoom}>Create Channel</Button>
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
                  {filteredRooms.map((room) => (
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
                          {room.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{room.name}</span>
                            {room.unreadCount > 0 && (
                              <Badge variant="default" className="ml-2 h-5 px-1.5">
                                {room.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {room.lastMessage || room.topic}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
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
                          <Users className="h-3 w-3" />
                          {selectedRoom.members} members
                          {selectedRoom.topic && ` • ${selectedRoom.topic}`}
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
                      <AnimatePresence>
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`flex gap-3 ${message.sender === nickname ? 'flex-row-reverse' : ''}`}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {message.sender[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`max-w-[70%] ${message.sender === nickname ? 'items-end' : ''}`}>
                              <div className={`flex items-center gap-2 mb-1 ${message.sender === nickname ? 'justify-end' : ''}`}>
                                <span className="text-sm font-medium">{message.sender}</span>
                                <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                              </div>
                              <div className={`p-3 rounded-2xl ${
                                message.sender === nickname 
                                  ? 'bg-primary text-primary-foreground rounded-br-md' 
                                  : 'bg-muted rounded-bl-md'
                              }`}>
                                <p className="text-sm">{message.content}</p>
                              </div>
                              {message.sender === nickname && (
                                <div className="flex justify-end mt-1">
                                  {message.read ? (
                                    <CheckCheck className="h-4 w-4 text-primary" />
                                  ) : (
                                    <Check className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
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
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
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