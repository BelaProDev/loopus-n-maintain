import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { dropboxAuth } from "@/lib/auth/dropbox";

const DocumentManager = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await dropboxAuth.getAccessToken();
      setIsAuthenticated(!!token);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async () => {
    try {
      await dropboxAuth.initialize();
      setIsAuthenticated(true);
      toast({
        title: "Success",
        description: "Successfully connected to Dropbox",
      });
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Failed to connect to Dropbox. Please check your access token.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    dropboxAuth.logout();
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "Successfully disconnected from Dropbox",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Document Manager</h2>
        {isAuthenticated ? (
          <Button variant="outline" onClick={handleLogout}>
            Disconnect Dropbox
          </Button>
        ) : (
          <Button onClick={handleLogin}>
            <LogIn className="w-4 h-4 mr-2" />
            Connect Dropbox
          </Button>
        )}
      </div>

      {isAuthenticated ? (
        <div className="grid gap-4">
          {/* Document management interface will be implemented here */}
          <p className="text-muted-foreground">Connected to Dropbox</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Connect your Dropbox account to manage documents
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentManager;