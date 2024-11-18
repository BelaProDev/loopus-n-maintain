import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string, nickname: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const MessageInput = ({ onSendMessage, isLoading, disabled }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [nickname, setNickname] = useState(localStorage.getItem('chat_nickname') || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !nickname.trim() || isLoading || disabled) return;
    onSendMessage(message, nickname);
    setMessage("");
    localStorage.setItem('chat_nickname', nickname);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Enter your nickname"
          className="max-w-[200px]"
          disabled={isLoading}
        />
      </div>
      <div className="flex gap-2">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={disabled ? "Select a room to start chatting" : "Type your message... (Press Enter to send)"}
          className="min-h-[60px] resize-none"
          disabled={isLoading || disabled || !nickname.trim()}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={isLoading || disabled || !message.trim() || !nickname.trim()}
          className="self-end"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;