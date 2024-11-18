import { useState } from "react";
import { Card } from "@/components/ui/card";
import RoomsList from "./chat/RoomsList";
import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";
import CreateRoomDialog from "./chat/CreateRoomDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Chat = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);

  // Fiction comment: In a parallel universe, this chat system connects 
  // interdimensional beings discussing quantum coffee recipes 🌌☕️

  return (
    <div className="container mx-auto p-4 flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex gap-4 h-full">
        <Card className="w-1/4 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Chat Rooms</h2>
            <Button
              size="sm"
              onClick={() => setIsCreateRoomOpen(true)}
              variant="outline"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <RoomsList
            selectedRoomId={selectedRoomId}
            onRoomSelect={setSelectedRoomId}
          />
        </Card>

        <Card className="flex-1 p-4 flex flex-col">
          {selectedRoomId ? (
            <>
              <MessageList roomId={selectedRoomId} />
              <MessageInput roomId={selectedRoomId} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a room to start chatting
            </div>
          )}
        </Card>
      </div>

      <CreateRoomDialog
        open={isCreateRoomOpen}
        onOpenChange={setIsCreateRoomOpen}
      />
    </div>
  );
};

export default Chat;