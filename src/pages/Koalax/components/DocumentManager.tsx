import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { LogIn } from "lucide-react";
import { uploadFile, listFiles, downloadFile, deleteFile, createFolder } from "@/lib/dropbox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DocumentToolbar from "./document/DocumentToolbar";
import FileList from "./document/FileList";
import MacOSFileList from "./document/MacOSFileList";
import FileListToggle from "./document/FileListToggle";
import { dropboxAuth } from "@/lib/auth/dropbox";
import BreadcrumbNav from "./document/BreadcrumbNav";

const DocumentManager = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [currentPath, setCurrentPath] = useState("/");
  const [isMacOS, setIsMacOS] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const deleteMutation = useMutation({
    mutationFn: async (path: string) => {
      await deleteFile(path);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropbox-files'] });
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete file",
        variant: "destructive",
      });
    }
  });

  const createFolderMutation = useMutation({
    mutationFn: async (folderPath: string) => {
      await createFolder(folderPath);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropbox-files'] });
      setNewFolderName("");
      toast({
        title: "Success",
        description: "Folder created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create folder",
        variant: "destructive",
      });
    }
  });

  const handleLogin = async () => {
    try {
      const response = await dropboxAuth.initiateAuth();
      if (response?.access_token) {
        setIsAuthenticated(true);
        toast({
          title: "Success",
          description: "Successfully connected to Dropbox",
        });
        refetch();
      }
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

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const fullPath = `${currentPath}${currentPath.endsWith('/') ? '' : '/'}${newFolderName.trim()}`;
      createFolderMutation.mutate(fullPath);
    }
  };

  const handleCreateInvoiceFolder = () => {
    createFolderMutation.mutate('/invoices');
  };

  const handleDelete = (path: string | undefined) => {
    if (path) {
      deleteMutation.mutate(path);
    }
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const FileListComponent = isMacOS ? MacOSFileList : FileList;

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
          <div className="flex justify-between items-center">
            <DocumentToolbar
              onCreateInvoiceFolder={handleCreateInvoiceFolder}
              onFileSelect={handleFileSelect}
              isUploading={uploadMutation.isPending}
              onRefresh={refetch}
              onLogout={() => {
                dropboxAuth.logout();
                setIsAuthenticated(false);
              }}
            />
            <FileListToggle isMacOS={isMacOS} onToggle={setIsMacOS} />
          </div>

          <BreadcrumbNav currentPath={currentPath} onNavigate={handleNavigate} />

          <div className="flex gap-2">
            <Input
              placeholder="New folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <Button onClick={handleCreateFolder}>Create Folder</Button>
          </div>

          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <FileListComponent
              files={files}
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
