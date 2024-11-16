import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { dropboxAuth } from "@/lib/auth/dropbox";
import DocumentToolbar from "./document/DocumentToolbar";
import FileList from "./document/FileList";
import BreadcrumbNav from "./document/BreadcrumbNav";
import { useDropboxManager } from "@/hooks/useDropboxManager";

const DocumentManager = () => {
  const [currentPath, setCurrentPath] = useState("/");
  
  const {
    files,
    isLoading,
    isAuthenticated,
    handleDownload,
    uploadMutation,
    deleteMutation,
    refetch,
  } = useDropboxManager(currentPath);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const handleDelete = (path: string) => {
    deleteMutation.mutate(path);
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const handleCreateInvoiceFolder = async () => {
    // Implementation for creating invoice folder
    console.log("Create invoice folder");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Document Manager</h2>
        {!isAuthenticated && (
          <Button onClick={() => dropboxAuth.initiateAuth()} className="w-full sm:w-auto">
            <LogIn className="w-4 h-4 mr-2" />
            Connect Dropbox
          </Button>
        )}
      </div>

      {isAuthenticated && (
        <div className="space-y-4">
          <DocumentToolbar
            onFileSelect={handleFileSelect}
            isUploading={uploadMutation.isPending}
            onRefresh={refetch}
            onLogout={() => dropboxAuth.logout()}
            currentPath={currentPath}
            onCreateInvoiceFolder={handleCreateInvoiceFolder}
          />

          <BreadcrumbNav currentPath={currentPath} onNavigate={handleNavigate} />

          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <FileList
              files={files || []}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onNavigate={handleNavigate}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentManager;