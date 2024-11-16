import { useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { uploadFile, listFiles, createFolder, deleteFile, downloadFile } from '@/lib/dropbox';
import { useAppDispatch, useAppSelector } from './useAppStore';
import { setFiles, setLoading, setError } from '@/store/slices/documentsSlice';

export const useDropboxManager = (currentPath: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.documents);

  const { data: files, isLoading, refetch } = useQuery({
    queryKey: ['files', currentPath],
    queryFn: () => listFiles(currentPath),
    enabled: isAuthenticated,
    onSuccess: (data) => {
      dispatch(setFiles(data));
    },
    onError: (error) => {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch files'));
    }
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

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch]);

  return {
    files,
    isLoading,
    isAuthenticated,
    uploadMutation,
    deleteMutation,
    createFolderMutation,
    handleDownload,
    refetch,
  };
};