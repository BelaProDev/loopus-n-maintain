import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface KoalaxAuthProps {
  onAuthenticate: () => void;
}

const KoalaxAuth = ({ onAuthenticate }: KoalaxAuthProps) => {
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_KOALAX_MDP) {
      onAuthenticate();
      localStorage.setItem('koalax_authenticated', 'true');
    } else {
      toast({
        title: "Error",
        description: "Invalid password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F1EA]">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl text-[#2E5984]">Koalax Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              Access Koalax
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default KoalaxAuth;