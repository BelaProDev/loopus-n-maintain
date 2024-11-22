import { useState } from 'react';
import { useDropbox } from '@/contexts/DropboxContext';
import { toast } from 'sonner';
import { DropboxEntry } from '@/types/dropbox';

export const useFileOperations = (currentPath: string, onRefresh?: () => void) => {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const { client } = useDropbox();

  const uploadFiles = async (files: FileList) => {
    if (!client) return;
    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        const reader = new FileReader();
        await new Promise((resolve, reject) => {
          reader.onload = async () => {
            try {
              const arrayBuffer = reader.result as ArrayBuffer;
              await client.filesUpload({
                path: `${currentPath}/${file.name}`,
                contents: arrayBuffer,
                mode: { '.tag': 'add' },
                autorename: true
              });
              toast.success(`Uploaded ${file.name}`);
              resolve(null);
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsArrayBuffer(file);
        });
      }
      onRefresh?.();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const createFolder = async (name: string) => {
    if (!client) return;
    
    try {
      await client.filesCreateFolderV2({
        path: `${currentPath}/${name}`.replace(/\/+/g, '/'),
        autorename: true
      });
      toast.success('Folder created successfully');
      onRefresh?.();
    } catch (error) {
      console.error('Create folder error:', error);
      toast.error('Failed to create folder');
    }
  };

  const deleteFiles = async (paths: string[]) => {
    if (!client) return;

    try {
      await Promise.all(
        paths.map(path =>
          client.filesDeleteV2({
            path
          })
        )
      );
      setSelectedFiles(new Set());
      toast.success('Files deleted successfully');
      onRefresh?.();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete files');
    }
  };

  const moveFiles = async (entries: DropboxEntry[], toPath: string) => {
    if (!client) return;

    try {
      await Promise.all(
        entries.map(entry =>
          client.filesMoveV2({
            from_path: entry.path_display!,
            to_path: `${toPath}/${entry.name}`
          })
        )
      );
      toast.success('Files moved successfully');
      onRefresh?.();
    } catch (error) {
      console.error('Move error:', error);
      toast.error('Failed to move files');
    }
  };

  return {
    selectedFiles,
    setSelectedFiles,
    uploadFiles,
    createFolder,
    deleteFiles,
    moveFiles,
    isUploading
  };
};