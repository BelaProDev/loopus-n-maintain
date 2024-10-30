import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { gitSync } from "@/lib/gitSync";
import { RefreshCw, GitBranch, Key } from "lucide-react";

const GitControls = () => {
  const [token, setToken] = useState("");
  const [repo, setRepo] = useState("");
  const [branch, setBranch] = useState("main");
  const { toast } = useToast();

  const handleInitialize = async () => {
    try {
      await gitSync.initialize({
        repo,
        branch,
        token,
        author: {
          name: "Admin User",
          email: "admin@example.com"
        }
      });
      
      toast({
        title: "Success",
        description: "Git repository initialized successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to initialize Git repository",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Git Synchronization</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Repository URL</label>
          <Input
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="https://github.com/username/repo.git"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Branch</label>
          <div className="flex items-center space-x-2">
            <GitBranch className="w-4 h-4" />
            <Input
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="main"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Personal Access Token</label>
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4" />
            <Input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxx"
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleInitialize} className="flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Initialize Git Sync
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GitControls;