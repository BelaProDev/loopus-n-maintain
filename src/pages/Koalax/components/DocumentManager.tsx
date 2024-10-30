import { Button } from "@/components/ui/button";
import { useDropboxAuth } from "@/hooks/useDropboxAuth";
import { LogIn } from "lucide-react";

const DocumentManager = () => {
  const { isAuthenticated, login, logout } = useDropboxAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Document Manager</h2>
        {isAuthenticated ? (
          <Button variant="outline" onClick={logout}>
            Disconnect Dropbox
          </Button>
        ) : (
          <Button onClick={login}>
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
