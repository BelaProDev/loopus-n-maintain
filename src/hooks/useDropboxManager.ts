import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFile, listFiles, downloadFile, deleteFile, createFolder } from "@/lib/dropbox";
import { dropboxAuth } from "@/lib/auth/dropbox";

export const useDropboxManager = (currentPath: string) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!dropboxAuth.getAccessToken());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: files, isLoading, refetch } = useQuery({
    queryKey: ['dropbox-files', currentPath],
    queryFn: () => listFiles(currentPath),
    enabled: isAuthenticated
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      return await uploadFile(file, currentPath);
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
      return await deleteFile(path);
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
      return await createFolder(folderPath);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropbox-files'] });
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
      await dropboxAuth.initiateAuth();
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "Failed to connect to Dropbox",
        variant: "destructive",
      });
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

  return {
    files,
    isLoading,
    isAuthenticated,
    handleLogin,
    handleDownload,
    uploadMutation,
    deleteMutation,
    createFolderMutation,
    refetch,
    setIsAuthenticated
  };
};