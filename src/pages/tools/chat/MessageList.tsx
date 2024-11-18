import { Card } from "@/components/ui/card";

interface Message {
  ref: { id: string };
  data: {
    sender: string;
    content: string;
    createdAt?: string;
  };
}

interface MessageListProps {
  messages: Message[];
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

  if (!messages || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No messages yet
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {messages.map((message) => (
        <Card 
          key={message.ref.id} 
          className="p-4 bg-gradient-to-r from-blue-950/50 to-blue-900/30 border-blue-800/50"
        >
          <div className="font-medium text-blue-400">
            {message.data.sender}
          </div>
          <div className="mt-1 text-gray-200">
            {message.data.content}
          </div>
          {message.data.createdAt && (
            <div className="mt-2 text-xs text-gray-500">
              {new Date(message.data.createdAt).toLocaleTimeString()}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default MessageList;