import { format } from "date-fns";
import { ChatMessage } from "@/types/chat";
import { Skeleton } from "@/components/ui/skeleton";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className="group flex flex-col hover:bg-muted/50 p-2 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold">{message.sender}</span>
            <span>•</span>
            <time className="text-xs">
              {format(new Date(message.timestamp), "PPp")}
            </time>
          </div>
          <p className="mt-1 break-words">{message.content}</p>
        </div>
      ))}
      {messages.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No messages yet. Start the conversation!
        </p>
      )}
    </div>
  );
};

export default MessageList;