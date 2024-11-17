import { format } from "date-fns";
import { ChatMessage } from "@/types/chat";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-4 bg-muted rounded w-48" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-4 bg-muted rounded w-64" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="flex flex-col">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold">{message.sender}</span>
            <span>•</span>
            <time>{format(new Date(message.timestamp), "HH:mm")}</time>
          </div>
          <p className="mt-1">{message.content}</p>
        </div>
      ))}
      {messages.length === 0 && (
        <p className="text-center text-muted-foreground">
          No messages yet. Start the conversation!
        </p>
      )}
    </div>
  );
};

export default MessageList;