import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { dropboxClient } from '@/lib/api/dropboxClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DropboxEntry } from '@/types/dropbox';

export const useDropboxManager = (currentPath: string) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: files, isLoading, refetch } = useQuery({
    queryKey: ['files', currentPath],
    queryFn: () => dropboxClient.listFolder(currentPath),
    enabled: isAuthenticated,
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, path }: { file: File; path: string }) => {
      await dropboxClient.uploadFile(file, path);
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

  const createFolderMutation = useMutation({
    mutationFn: async (path: string) => {
      await dropboxClient.createFolder(path);
    },
    onSuccess: () => {
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

  const deleteMutation = useMutation({
    mutationFn: async (path: string) => {
      await dropboxClient.deleteFile(path);
    },
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

  const handleDownload = async (path: string | undefined, fileName: string) => {
    if (!path) return;
    try {
      const blob = await dropboxClient.downloadFile(path);
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
    createFolderMutation,
    deleteMutation,
    handleDownload,
    refetch,
  };
};