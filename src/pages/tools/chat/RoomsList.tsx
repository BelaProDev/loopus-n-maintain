import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Hash } from "lucide-react";
import { motion } from "framer-motion";
import { ChatRoom } from '@/types/chat';
import CreateRoomDialog from './CreateRoomDialog';

interface RoomsListProps {
  rooms: ChatRoom[];
  activeRoom: string;
  onRoomSelect: (roomId: string) => void;
  onRoomCreate: (name: string, topic: string) => Promise<void>;
}

const RoomsList = ({ rooms, activeRoom, onRoomSelect, onRoomCreate }: RoomsListProps) => {
  return (
    <div className="col-span-3 border-r border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-primary" />
          <h2 className="font-mono text-lg">Rooms</h2>
        </div>
        <CreateRoomDialog onRoomCreate={onRoomCreate} />
      </div>
      <ScrollArea className="h-[calc(100%-2rem)]">
        {rooms.map((room) => (
          <motion.button
            key={room.id}
            whileHover={{ x: 4 }}
            onClick={() => onRoomSelect(room.id)}
            className={`w-full text-left p-2 rounded font-mono ${
              activeRoom === room.id ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
            }`}
          >
            #{room.name}
          </motion.button>
        ))}
      </ScrollArea>
    </div>
  );
};

export default RoomsList;