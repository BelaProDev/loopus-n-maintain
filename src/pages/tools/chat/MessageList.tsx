import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "@/lib/fauna/types/chat";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useRef } from "react";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  if (!messages?.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-lg">No messages yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 pr-4">
      <div className="space-y-3 p-4">
        {messages.map((message) => (
          <Card 
            key={message.id} 
            className="p-3 bg-background/50 hover:bg-accent/10 transition-colors border-border/50"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="font-medium text-primary/90">
                {message.sender}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
              </div>
            </div>
            <div className="text-sm text-foreground/80 mt-1 break-words">
              {message.content}
            </div>
          </Card>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;