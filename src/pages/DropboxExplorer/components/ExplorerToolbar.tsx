import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Upload, LayoutGrid, List, RefreshCw, LogOut } from 'lucide-react';
import { useDropboxAuth } from '@/hooks/useDropboxAuth';
import { motion } from 'framer-motion';

interface ExplorerToolbarProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  viewMode: 'grid' | 'list';
  onRefresh: () => void;
}

export const ExplorerToolbar = ({
  onFileSelect,
  isUploading,
  onViewModeChange,
  viewMode,
  onRefresh,
}: ExplorerToolbarProps) => {
  const { logout } = useDropboxAuth();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-4 p-6 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg"
    >
      <div className="flex items-center gap-4 flex-1">
        <Input
          type="file"
          onChange={onFileSelect}
          className="hidden"
          ref={fileInputRef}
          disabled={isUploading}
        />
        <Button 
          variant="outline"
          disabled={isUploading}
          className="bg-white/70 hover:bg-purple-50"
          onClick={handleUploadClick}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <ToggleGroup type="single" value={viewMode} onValueChange={(v) => onViewModeChange(v as 'grid' | 'list')}>
          <ToggleGroupItem value="grid" className="data-[state=on]:bg-purple-100">
            <LayoutGrid className="w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" className="data-[state=on]:bg-purple-100">
            <List className="w-4 h-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="hover:bg-purple-50"
          onClick={onRefresh}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>

        <Button 
          variant="ghost"
          onClick={logout}
          className="hover:bg-pink-50 hover:text-pink-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </div>
    </motion.div>
  );
};