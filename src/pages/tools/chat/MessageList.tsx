import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "@/lib/fauna/types/chat";
import { formatDistanceToNow } from "date-fns";

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

  const formatMessageTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "";
    }
  };

  return (
    <ScrollArea className="flex-1 pr-4">
      <div className="space-y-4 p-4">
        {messages.map((message) => (
          <Card 
            key={message.id} 
            className="p-4 bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium text-primary">
                {message.sender}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatMessageTime(message.createdAt)}
              </div>
            </div>
            <div className="text-sm text-card-foreground break-words">
              {message.content}
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default MessageList;