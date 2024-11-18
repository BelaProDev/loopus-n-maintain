import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "@/lib/fauna/types/chat";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const MessageList = ({ messages = [], isLoading }: MessageListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Loading messages...
      </div>
    );
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No messages yet
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-4 p-4">
        {messages.map((message) => (
          <Card 
            key={message.id} 
            className="p-4 bg-gradient-to-r from-blue-950/50 to-blue-900/30 border-blue-800/50"
          >
            <div className="font-medium text-blue-400">
              {message.sender}
            </div>
            <div className="mt-1 text-gray-200">
              {message.content}
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default MessageList;