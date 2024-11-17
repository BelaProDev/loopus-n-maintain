import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Hash, Plus } from "lucide-react";
import { useState } from "react";
import { ChatRoom } from "@/types/chat";
import { cn } from "@/lib/utils";

interface RoomsListProps {
  rooms: ChatRoom[];
  activeRoom: string;
  onRoomSelect: (roomId: string) => void;
  onCreateRoom: (name: string, topic: string) => void;
}

const RoomsList = ({ rooms, activeRoom, onRoomSelect, onCreateRoom }: RoomsListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomTopic, setNewRoomTopic] = useState("");

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return;
    onCreateRoom(newRoomName, newRoomTopic);
    setNewRoomName("");
    setNewRoomTopic("");
    setIsOpen(false);
  };

  return (
    <div className="col-span-3 border-r border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Rooms</h2>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Room</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Room Name</Label>
                <Input
                  id="name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Enter room name..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic">Topic (optional)</Label>
                <Textarea
                  id="topic"
                  value={newRoomTopic}
                  onChange={(e) => setNewRoomTopic(e.target.value)}
                  placeholder="Enter room topic..."
                />
              </div>
              <Button 
                onClick={handleCreateRoom} 
                className="w-full"
                disabled={!newRoomName.trim()}
              >
                Create Room
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="h-[calc(100vh-20rem)]">
        <div className="space-y-1">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => onRoomSelect(room.id)}
              className={cn(
                "w-full text-left p-2 rounded-md transition-colors",
                activeRoom === room.id
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted"
              )}
            >
              <div className="font-medium">#{room.name}</div>
              {room.topic && (
                <div className="text-sm text-muted-foreground truncate">
                  {room.topic}
                </div>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RoomsList;