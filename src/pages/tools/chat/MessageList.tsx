import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import type { ChatMessage } from "@/lib/fauna/types/chat";
import { format } from "date-fns";

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

  const formatMessageTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'HH:mm');
    } catch {
      return '';
    }
  };

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <Card 
            key={message.id} 
            className="p-3 bg-gradient-to-r from-blue-950/50 to-blue-900/30 border-blue-800/50"
          >
            <div className="flex justify-between items-start">
              <span className="font-medium text-blue-400">
                {message.sender}
              </span>
              <span className="text-xs text-gray-400">
                {formatMessageTime(message.createdAt)}
              </span>
            </div>
            <p className="mt-1 text-gray-200 break-words">
              {message.content}
            </p>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default MessageList;