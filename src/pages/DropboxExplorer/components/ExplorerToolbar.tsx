import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Upload, LayoutGrid, List, RefreshCw, LogOut, FolderPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ExplorerToolbarProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  viewMode: 'grid' | 'list';
  onRefresh: () => void;
  onCreateFolder: (name: string) => void;
  currentPath: string;
}

export const ExplorerToolbar = ({
  onFileSelect,
  isUploading,
  onViewModeChange,
  viewMode,
  onRefresh,
  onCreateFolder,
  currentPath,
}: ExplorerToolbarProps) => {
  const [newFolderName, setNewFolderName] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }
    onCreateFolder(newFolderName);
    setNewFolderName('');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b">
      <div className="flex items-center gap-4 flex-1">
        <Input
          type="file"
          onChange={onFileSelect}
          className="hidden"
          ref={fileInputRef}
          multiple
          disabled={isUploading}
        />
        <Button 
          variant="outline"
          disabled={isUploading}
          onClick={handleUploadClick}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <FolderPlus className="w-4 h-4 mr-2" />
              New Folder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <Button onClick={handleCreateFolder}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex items-center gap-4">
        <ToggleGroup type="single" value={viewMode} onValueChange={(v) => onViewModeChange(v as 'grid' | 'list')}>
          <ToggleGroupItem value="grid">
            <LayoutGrid className="w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list">
            <List className="w-4 h-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onRefresh}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};