import { useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { uploadFile, listFiles, createFolder, deleteFile, downloadFile } from '@/lib/dropbox';
import { useAppDispatch, useAppSelector } from './useAppStore';
import { setFiles, setLoading, setError } from '@/store/slices/documentsSlice';
import { DropboxFile } from '@/types/dropbox';
import { dropboxAuth } from '@/lib/auth/dropbox';

export const useDropboxManager = (currentPath: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.documents);

  const { data: files, isLoading, refetch } = useQuery({
    queryKey: ['files', currentPath],
    queryFn: async () => {
      const response = await listFiles(currentPath);
      return response.map(file => ({
        ...file,
        path: file.path_display || '',
        isFolder: file['.tag'] === 'folder',
        lastModified: file['.tag'] === 'file' ? file.server_modified || new Date().toISOString() : new Date().toISOString(),
        size: file['.tag'] === 'file' ? file.size || 0 : 0,
      })) as DropboxFile[];
    },
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (files) {
      dispatch(setFiles(files));
    }
  }, [files, dispatch]);

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

  const handleLogin = () => {
    dropboxAuth.authenticate();
  };

  return {
    files,
    isLoading,
    isAuthenticated,
    uploadMutation,
    deleteMutation,
    createFolderMutation,
    handleDownload,
    handleLogin,
    refetch,
  };
};