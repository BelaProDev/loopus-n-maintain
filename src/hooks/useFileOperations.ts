import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropbox } from '@/contexts/DropboxContext';
import { toast } from 'sonner';

export const useFileOperations = (currentPath: string, onRefresh?: () => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const { client } = useDropbox();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!client) throw new Error('No Dropbox client');
      
      const reader = new FileReader();
      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });

      return client.filesUpload({
        path: `${currentPath}/${file.name}`,
        contents: arrayBuffer,
        mode: { '.tag': 'add' },
        autorename: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropbox-files', currentPath] });
      onRefresh?.();
    },
    onError: (error) => {
      toast.error('Failed to upload file');
      console.error('Upload error:', error);
    }
  });

  const createFolderMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!client) throw new Error('No Dropbox client');
      
      return client.filesCreateFolderV2({
        path: `${currentPath}/${name}`.replace(/\/+/g, '/'),
        autorename: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropbox-files', currentPath] });
      toast.success('Folder created successfully');
      onRefresh?.();
    },
    onError: (error) => {
      toast.error('Failed to create folder');
      console.error('Create folder error:', error);
    }
  });

  const uploadFiles = async (files: FileList) => {
    if (!client) return;
    setIsUploading(true);

    try {
      await Promise.all(
        Array.from(files).map(file => uploadMutation.mutateAsync(file))
      );
    } finally {
      setIsUploading(false);
    }
  };

  const createFolder = (name: string) => {
    createFolderMutation.mutate(name);
  };

  return {
    uploadFiles,
    createFolder,
    isUploading
  };
};