import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CreateRoomDialogProps {
  onRoomCreate: (name: string, topic: string) => Promise<void>;
}

const CreateRoomDialog = ({ onRoomCreate }: CreateRoomDialogProps) => {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !topic.trim()) {
      toast({
        title: "Invalid input",
        description: "Both name and topic are required",
        variant: "destructive"
      });
      return;
    }

    await onRoomCreate(name, topic);
    setName("");
    setTopic("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New Room
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room-name">Room Name</Label>
            <Input
              id="room-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. general"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="room-topic">Topic</Label>
            <Input
              id="room-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. General discussion"
            />
          </div>
          <Button type="submit" className="w-full">Create Room</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomDialog;