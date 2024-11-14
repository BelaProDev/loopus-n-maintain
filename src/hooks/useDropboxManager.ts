import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { dropboxAuth } from '@/lib/auth/dropbox';
import { toast } from 'sonner';
import {
  listFiles,
  uploadFile,
  downloadFile,
  createFolder,
  deleteFile,
  type FileMetadata
} from '@/lib/document/documentUtils';

export const useDropboxManager = (currentPath: string) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!dropboxAuth.getAccessToken());

  const { data: files = [], isLoading, refetch } = useQuery({
    queryKey: ['dropbox-files', currentPath],
    queryFn: () => listFiles(currentPath),
    enabled: isAuthenticated,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadFile(file, currentPath),
    onSuccess: () => {
      toast.success('File uploaded successfully');
      refetch();
    },
    onError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const createFolderMutation = useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      toast.success('Folder created successfully');
      refetch();
    },
    onError: (error: Error) => {
      toast.error(`Failed to create folder: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      toast.success('Item deleted successfully');
      refetch();
    },
    onError: (error: Error) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });

  const handleLogin = async () => {
    try {
      await dropboxAuth.authenticate();
      setIsAuthenticated(true);
      toast.success('Connected to Dropbox successfully');
    } catch (error) {
      toast.error('Failed to connect to Dropbox');
    }
  };

  const handleDownload = async (path: string) => {
    try {
      const blob = await downloadFile(path);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = path.split('/').pop() || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('File downloaded successfully');
    } catch (error) {
      toast.error('Failed to download file');
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
    setIsAuthenticated,
  };
};