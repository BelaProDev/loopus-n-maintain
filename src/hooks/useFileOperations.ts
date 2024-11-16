import { useState } from 'react';
import { useDropbox } from '@/contexts/DropboxContext';
import { toast } from 'sonner';
import { DropboxEntry } from '@/types/dropbox';

export const useFileOperations = (currentPath: string) => {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const { client } = useDropbox();

  const uploadFile = async ({ file, path }: { file: File; path: string }) => {
    if (!client) throw new Error('No Dropbox client');

    try {
      await client.filesUpload({
        path: `${path}/${file.name}`,
        contents: file,
        mode: { '.tag': 'add' },
        autorename: true
      });
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
      throw error;
    }
  };

  const createFolder = async (name: string) => {
    if (!client) throw new Error('No Dropbox client');

    try {
      await client.filesCreateFolderV2({
        path: `${currentPath}/${name}`,
        autorename: true
      });
      toast.success('Folder created successfully');
    } catch (error) {
      console.error('Create folder error:', error);
      toast.error('Failed to create folder');
      throw error;
    }
  };

  const deleteFiles = async (paths: string[]) => {
    if (!client) throw new Error('No Dropbox client');

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
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete files');
      throw error;
    }
  };

  const moveFiles = async (entries: DropboxEntry[], toPath: string) => {
    if (!client) throw new Error('No Dropbox client');

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
    } catch (error) {
      console.error('Move error:', error);
      toast.error('Failed to move files');
      throw error;
    }
  };

  return {
    selectedFiles,
    setSelectedFiles,
    uploadFile,
    createFolder,
    deleteFiles,
    moveFiles
  };
};