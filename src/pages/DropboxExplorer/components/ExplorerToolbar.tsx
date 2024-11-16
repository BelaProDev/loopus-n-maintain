import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Upload, LayoutGrid, List, RefreshCw } from 'lucide-react';
import { useDropboxAuth } from '@/hooks/useDropboxAuth';

interface ExplorerToolbarProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  viewMode: 'grid' | 'list';
}

export const ExplorerToolbar = ({
  onFileSelect,
  isUploading,
  onViewModeChange,
  viewMode,
}: ExplorerToolbarProps) => {
  const { isLoading: isAuthLoading, login, logout } = useDropboxAuth();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          onChange={onFileSelect}
          className="max-w-[200px]"
          disabled={isUploading}
        />
        <Button variant="outline" disabled={isUploading}>
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
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
        
        <Button variant="ghost" size="icon">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};