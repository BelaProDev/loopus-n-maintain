import { Card } from "@/components/ui/card";
import RoomsList from "./chat/RoomsList";
import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";
import CreateRoomDialog from "./chat/CreateRoomDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { chatService } from "@/services/chatService";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppStore";
import { setNickname, setSelectedRoom, setCreateRoomOpen } from "@/store/slices/chatSlice";

const Chat = () => {
  const dispatch = useAppDispatch();
  const { nickname, selectedRoomId, isCreateRoomOpen } = useAppSelector((state) => state.chat);

  const { data: rooms = [], isLoading: isLoadingRooms } = useQuery({
    queryKey: ['rooms'],
    queryFn: chatService.listRooms
  });

  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', selectedRoomId],
    queryFn: () => selectedRoomId ? chatService.listMessages(selectedRoomId) : [],
    enabled: !!selectedRoomId
  });

  const handleSendMessage = async (content: string, sender: string) => {
    if (!selectedRoomId) return;
    try {
      await chatService.sendMessage(selectedRoomId, content, sender);
      toast.success("Message sent");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex gap-4 h-full">
        <Card className="w-1/4 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Chat Rooms</h2>
            <Button
              size="sm"
              onClick={() => dispatch(setCreateRoomOpen(true))}
              variant="outline"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <RoomsList
            rooms={rooms}
            activeRoom={selectedRoomId || ''}
            onRoomSelect={(roomId) => dispatch(setSelectedRoom(roomId))}
            isLoading={isLoadingRooms}
          />
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
      </div>

      <CreateRoomDialog
        isOpen={isCreateRoomOpen}
        onOpenChange={(open) => dispatch(setCreateRoomOpen(open))}
        onCreateRoom={chatService.createRoom}
      />
    </div>
  );
};

export default Chat;