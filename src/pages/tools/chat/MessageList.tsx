import { ChatMessage } from "@/types/chat";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface MessageListProps {
  messages: ChatMessage[];
}

const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex flex-col",
            message.type === "system" && "opacity-75"
          )}
        >
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