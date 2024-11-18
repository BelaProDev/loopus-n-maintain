import { ScrollArea } from "@/components/ui/scroll-area";
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

  if (!Array.isArray(messages) || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No messages yet
      </div>
    );
  }

  const formatMessageTime = (timestamp: string | { isoString: string } | Date) => {
    try {
      // Handle different timestamp formats
      const dateStr = typeof timestamp === 'object' && 'isoString' in timestamp 
        ? timestamp.isoString 
        : String(timestamp);
      
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return format(date, "HH:mm");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="flex flex-col space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{message.sender}</span>
            <span className="text-xs text-muted-foreground">
              {formatMessageTime(message.timestamp)}
            </span>
          </div>
          <p className="text-sm">{message.content}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;