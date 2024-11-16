import { useState } from 'react';
import { DropboxEntry } from '@/types/dropbox';

export const useFileSelection = () => {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [lastSelected, setLastSelected] = useState<string | null>(null);

  const toggleSelection = (file: DropboxEntry, isShiftKey: boolean) => {
    const newSelection = new Set(selectedFiles);

    if (isShiftKey && lastSelected && file.path_display) {
      // Implement shift-click multi-select logic here
      // This is a simplified version - you might want to enhance it based on file order
      if (newSelection.has(file.path_display)) {
        newSelection.delete(file.path_display);
      } else {
        newSelection.add(file.path_display);
      }
    } else if (file.path_display) {
      if (newSelection.has(file.path_display)) {
        newSelection.delete(file.path_display);
      } else {
        newSelection.add(file.path_display);
      }
      setLastSelected(file.path_display);
    }

    setSelectedFiles(newSelection);
  };

  const clearSelection = () => {
    setSelectedFiles(new Set());
    setLastSelected(null);
  };

  const selectAll = (files: DropboxEntry[]) => {
    const newSelection = new Set<string>();
    files.forEach(file => {
      if (file.path_display) {
        newSelection.add(file.path_display);
      }
    });
    setSelectedFiles(newSelection);
  };

  return {
    selectedFiles,
    toggleSelection,
    clearSelection,
    selectAll,
    isSelected: (file: DropboxEntry) => file.path_display ? selectedFiles.has(file.path_display) : false
  };
};