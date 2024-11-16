import { useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from './useAppStore';
import { setFiles } from '@/store/slices/documentsSlice';
import { DropboxFile, FileMetadata } from '@/types/dropbox';
import { dropboxAuth } from '@/lib/auth/dropbox';
import { convertToFileMetadata, sortFiles } from '@/lib/utils/fileUtils';
import { dropboxClient } from '@/lib/api/dropboxClient';

export const useDropboxManager = (currentPath: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.documents);

  const { data: files, isLoading, refetch } = useQuery({
    queryKey: ['files', currentPath],
    queryFn: () => dropboxClient.listFolder(currentPath),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (files) {
      dispatch(setFiles(files));
    }
  }, [files, dispatch]);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      await dropboxClient.uploadFile(file, currentPath);
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
    mutationFn: dropboxClient.deleteFile,
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
    uploadMutation,
    deleteMutation,
    handleDownload,
    refetch,
  };
};