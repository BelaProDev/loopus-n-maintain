import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  uploadFile, 
  listFiles, 
  createFolder, 
  deleteFile,
  searchFiles,
  moveFile,
  copyFile,
  createSharedLink,
  downloadFile
} from '@/lib/dropbox';

export const useDropboxManager = (currentPath: string) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('dropbox_access_token'));
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
  });

  const handleDownload = async (path: string, fileName: string) => {
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