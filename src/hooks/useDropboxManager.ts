import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  uploadFile, 
  downloadFile, 
  listFiles, 
  createFolder, 
  deleteFile,
  searchFiles,
  moveFile,
  copyFile,
  createSharedLink,
  getFileMetadata
} from '@/lib/dropbox';

export const useDropboxManager = (currentPath: string) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

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
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    },
  });

  const searchMutation = useMutation({
    mutationFn: searchFiles,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Search completed",
      });
    },
  });

  const moveMutation = useMutation({
    mutationFn: ({ from, to }: { from: string; to: string }) => moveFile(from, to),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "File moved successfully",
      });
      refetch();
    },
  });

  const copyMutation = useMutation({
    mutationFn: ({ from, to }: { from: string; to: string }) => copyFile(from, to),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "File copied successfully",
      });
      refetch();
    },
  });

  const createLinkMutation = useMutation({
    mutationFn: createSharedLink,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Shared link created successfully",
      });
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
      refetch();
    },
  });

  const createFolderMutation = useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Folder created successfully",
      });
      refetch();
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
      
      toast({
        title: "Success",
        description: "File downloaded successfully",
      });
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
    searchMutation,
    moveMutation,
    copyMutation,
    createLinkMutation,
    handleDownload,
    refetch,
  };
};