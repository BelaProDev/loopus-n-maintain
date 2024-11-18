import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import type { ChatRoom } from "@/lib/fauna/types/chat";

interface RoomsListProps {
  rooms: ChatRoom[];
  activeRoom: string;
  onRoomSelect: (roomId: string) => void;
  isLoading: boolean;
}

const RoomsList = ({
  rooms = [],
  activeRoom,
  onRoomSelect,
  isLoading
}: RoomsListProps) => {
  if (isLoading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading rooms...
      </div>
    );
  }

  if (!Array.isArray(rooms) || rooms.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No rooms available
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-2">
        {rooms.map((room) => (
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
        ))}
      </div>
    </ScrollArea>
  );
};

export default RoomsList;