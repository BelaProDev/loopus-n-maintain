import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import CreateRoomDialog from "./CreateRoomDialog";
import type { ChatRoom } from "@/lib/fauna/types/chat";

interface RoomsListProps {
  rooms: ChatRoom[];
  activeRoom: string;
  onRoomSelect: (roomId: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const RoomsList = ({
  rooms,
  activeRoom,
  onRoomSelect,
  onRefresh,
  isLoading
}: RoomsListProps) => {
  return (
    <div className="col-span-3 border-r h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">Chat Rooms</h2>
        <div className="flex items-center gap-2">
          <CreateRoomDialog onRoomCreated={onRefresh} />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading rooms...
            </div>
          ) : rooms.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No rooms available
            </div>
          ) : (
            rooms.map((room) => (
              <Button
                key={room.id}
                variant={activeRoom === room.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  activeRoom === room.id && "bg-muted"
                )}
                onClick={() => onRoomSelect(room.id)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                <div className="truncate">{room.name}</div>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RoomsList;