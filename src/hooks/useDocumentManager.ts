import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { uploadFile, downloadFile, listFiles, createFolder, deleteFile } from "@/lib/dropbox";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useDocumentManager = (currentPath: string) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: files, isLoading, refetch } = useQuery({
    queryKey: ['files', currentPath],
    queryFn: () => listFiles(currentPath),
    enabled: isAuthenticated,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      await uploadFile(file, currentPath);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    },
  });

  const createFolderMutation = useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Folder created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      });
    },
  });

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
    setIsAuthenticated,
    uploadMutation,
    deleteMutation,
    createFolderMutation,
    handleDownload,
    refetch,
  };
};