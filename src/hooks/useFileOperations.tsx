import { useState } from 'react';
import { useDropbox } from '@/contexts/DropboxContext';
import { toast } from 'sonner';
import { DropboxEntry } from '@/types/dropbox';

export const useFileOperations = (currentPath: string, onRefresh: () => void) => {
  const { client } = useDropbox();
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = async (files: FileList) => {
    if (!client) return;
    setIsUploading(true);

    for (const file of Array.from(files)) {
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          const arrayBuffer = reader.result as ArrayBuffer;
          await client.filesUpload({
            path: `${currentPath}/${file.name}`,
            contents: arrayBuffer,
            mode: { '.tag': 'add' },
            autorename: true
          });
          toast.success(`Uploaded ${file.name}`);
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setIsUploading(false);
    onRefresh();
  };

  const createFolder = async (name: string) => {
    if (!client) return;
    
    try {
      await client.filesCreateFolderV2({
        path: `${currentPath}/${name}`.replace(/\/+/g, '/'),
        autorename: true
      });
      toast.success('Folder created successfully');
      onRefresh();
    } catch (error) {
      console.error('Create folder error:', error);
      toast.error('Failed to create folder');
    }
  };

  return {
    uploadFiles,
    createFolder,
    isUploading
  };
};