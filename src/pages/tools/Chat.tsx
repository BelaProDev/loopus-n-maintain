import { Card } from "@/components/ui/card";
import RoomsList from "./chat/RoomsList";
import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";
import CreateRoomDialog from "./chat/CreateRoomDialog";
import { Button } from "@/components/ui/button";
import { Plus, Users, Settings, Search } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/services/chatService";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppStore";
import { setNickname, setSelectedRoom, setCreateRoomOpen } from "@/store/slices/chatSlice";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Chat = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { nickname, selectedRoomId, isCreateRoomOpen } = useAppSelector((state) => state.chat);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);

  const { data: rooms = [], isLoading: isLoadingRooms } = useQuery({
    queryKey: ['rooms'],
    queryFn: chatService.listRooms,
    staleTime: 1000 * 60 // 1 minute
  });

  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', selectedRoomId],
    queryFn: () => selectedRoomId ? chatService.listMessages(selectedRoomId) : Promise.resolve([]),
    enabled: !!selectedRoomId,
    refetchInterval: 3000 // Refresh every 3 seconds
  });

  const handleSendMessage = async (content: string, sender: string) => {
    if (!selectedRoomId) return;
    try {
      await chatService.sendMessage(selectedRoomId, content, sender);
      await queryClient.invalidateQueries({ queryKey: ['messages', selectedRoomId] });
      toast.success("Message sent");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleCreateRoom = async (name: string, topic?: string) => {
    try {
      await chatService.createRoom(name, topic);
      await queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success("Room created successfully");
      dispatch(setCreateRoomOpen(false));
    } catch (error) {
      toast.error("Failed to create room");
    }
  };

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.topic?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex gap-4 h-full">
        <Card className="w-1/4 p-4 flex flex-col">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Chat Rooms</h2>
              <Button
                size="sm"
                onClick={() => dispatch(setCreateRoomOpen(true))}
                variant="outline"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant={showOnlineUsers ? "default" : "outline"}
                onClick={() => setShowOnlineUsers(!showOnlineUsers)}
                className="w-full"
              >
                <Users className="h-4 w-4 mr-2" />
                Online Users
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="px-2"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 flex-1 overflow-hidden">
            <RoomsList
              rooms={filteredRooms}
              activeRoom={selectedRoomId || ''}
              onRoomSelect={(roomId) => dispatch(setSelectedRoom(roomId))}
              isLoading={isLoadingRooms}
            />
          </div>
        </Card>

        <Card className="flex-1 p-4 flex flex-col">
          {selectedRoomId ? (
            <>
              <MessageList
                messages={messages}
                isLoading={isLoadingMessages}
              />
              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={!selectedRoomId}
                nickname={nickname}
                onNicknameChange={(newNickname) => dispatch(setNickname(newNickname))}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a room to start chatting
            </div>
          )}
        </Card>

        {showOnlineUsers && (
          <Card className="w-1/5 p-4">
            <h3 className="font-semibold mb-4">Online Users</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>John Doe</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Jane Smith</span>
              </div>
            </div>
          </Card>
        )}
      </div>

      <CreateRoomDialog
        isOpen={isCreateRoomOpen}
        onOpenChange={(open) => dispatch(setCreateRoomOpen(open))}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
};

export default Chat;