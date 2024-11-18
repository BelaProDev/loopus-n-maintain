interface Message {
  id: string;
  sender: string;
  content: string;
}

interface MessageResponse {
  data: {
    data: Message[];
  };
}

interface MessageListProps {
  messages: MessageResponse;
  isLoading: boolean;
}

const MessageList = ({ messages = { data: { data: [] } }, isLoading }: MessageListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Loading messages...
      </div>
    );
  }

  if (!messages?.data?.data || messages.data.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No messages yet
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {messages.data.data.map((message) => (
        <div 
          key={message.id} 
          className="rounded-lg p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 backdrop-blur-sm"
        >
          <div className="font-medium text-purple-700 dark:text-purple-300">
            {message.sender}
          </div>
          <div className="mt-1 text-gray-700 dark:text-gray-300">
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;