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
  createSharedLink
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
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Shared link created successfully",
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
    searchMutation,
    moveMutation,
    copyMutation,
    createLinkMutation,
    refetch,
  };
};