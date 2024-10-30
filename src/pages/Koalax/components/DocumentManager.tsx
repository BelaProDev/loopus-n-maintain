import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDropboxAuth } from "@/hooks/useDropboxAuth";
import { LogIn } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { uploadFile, listFiles, downloadFile } from "@/lib/dropbox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DocumentToolbar from "./document/DocumentToolbar";
import FileList from "./document/FileList";

const DocumentManager = () => {
  const { isAuthenticated, login, logout } = useDropboxAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentPath, setCurrentPath] = useState("/");

  const { data: files, isLoading, refetch } = useQuery({
    queryKey: ['dropbox-files', currentPath],
    queryFn: () => listFiles(currentPath),
    enabled: isAuthenticated
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      await uploadFile(file, currentPath);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropbox-files'] });
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    }
  });

  const handleLogin = async () => {
    try {
      await login();
      toast({
        title: "Success",
        description: "Successfully connected to Dropbox",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "Failed to connect to Dropbox",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const handleDownload = async (path: string | undefined, fileName: string) => {
    if (!path) return;
    try {
      const blob = await downloadFile(path);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const handleCreateInvoiceFolder = async () => {
    try {
      await uploadFile(new File([""], ".keep"), "/invoices");
      toast({
        title: "Success",
        description: "Invoices folder created",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invoices folder",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Document Manager</h2>
        {!isAuthenticated && (
          <Button onClick={handleLogin}>
            <LogIn className="w-4 h-4 mr-2" />
            Connect Dropbox
          </Button>
        )}
      </div>

      {isAuthenticated && (
        <div className="space-y-4">
          <DocumentToolbar
            onCreateInvoiceFolder={handleCreateInvoiceFolder}
            onFileSelect={handleFileSelect}
            isUploading={uploadMutation.isPending}
            onRefresh={refetch}
            onLogout={logout}
          />

          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <FileList
              files={files}
              onDownload={handleDownload}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentManager;