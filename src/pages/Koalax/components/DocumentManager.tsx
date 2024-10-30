import { useState, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { LogIn } from "lucide-react";
import { uploadFile, listFiles, createFolder } from "@/lib/dropbox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DocumentToolbar from "./document/DocumentToolbar";
import FileList from "./document/FileList";
import { dropboxAuth } from "@/lib/auth/dropbox";
import BreadcrumbNav from "./document/BreadcrumbNav";

const DocumentManager = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [currentPath, setCurrentPath] = useState("/");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: files, isLoading, refetch } = useQuery({
    queryKey: ['dropbox-files', currentPath],
    queryFn: () => listFiles(currentPath),
    enabled: isAuthenticated,
    staleTime: 30000,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => uploadFile(file, currentPath),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropbox-files'] });
      toast({ title: "Success", description: "File uploaded successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    }
  });

  const createFolderMutation = useMutation({
    mutationFn: (folderPath: string) => createFolder(folderPath),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropbox-files'] });
      setNewFolderName("");
      toast({ title: "Success", description: "Folder created successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create folder",
        variant: "destructive",
      });
    }
  });

  const handleLogin = useCallback(async () => {
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
  }, [toast, refetch]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) uploadMutation.mutate(file);
  }, [uploadMutation]);

  const handleCreateFolder = useCallback(() => {
    if (newFolderName.trim()) {
      const fullPath = `${currentPath}${currentPath.endsWith('/') ? '' : '/'}${newFolderName.trim()}`;
      createFolderMutation.mutate(fullPath);
    }
  }, [newFolderName, currentPath, createFolderMutation]);

  const handleNavigate = useCallback((path: string) => {
    setCurrentPath(path);
  }, []);

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
            onFileSelect={handleFileSelect}
            isUploading={uploadMutation.isPending}
            onRefresh={refetch}
            onLogout={() => {
              dropboxAuth.logout();
              setIsAuthenticated(false);
            }}
            currentPath={currentPath}
          />

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
            <FileList
              files={files}
              onNavigate={handleNavigate}
              onDownload={() => {}}
              onDelete={() => {}}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default memo(DocumentManager);