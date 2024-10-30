import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface KoalaxAuthProps {
  onAuthenticate: () => void;
}

const KoalaxAuth = ({ onAuthenticate }: KoalaxAuthProps) => {
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "miaou00") {
      onAuthenticate();
    } else {
      toast({
        title: "Error",
        description: "Invalid password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-64"
        />
        <Button type="submit" className="w-full">
          Access Koalax
        </Button>
      </form>
    </div>
  );
};

export default KoalaxAuth;