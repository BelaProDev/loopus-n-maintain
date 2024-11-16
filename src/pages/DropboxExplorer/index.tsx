import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { dropboxClient } from '@/lib/api/dropboxClient';
import { setFiles, setCurrentPath, toggleFileSelection, setViewMode } from '@/store/slices/explorerSlice';
import { FileGrid } from './components/FileGrid';
import { FileList } from './components/FileList';
import { ExplorerToolbar } from './components/ExplorerToolbar';
import { NavigationBreadcrumb } from './components/NavigationBreadcrumb';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const DropboxExplorer = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentPath, viewMode } = useSelector((state: RootState) => state.explorer);

  const { data: files, isLoading } = useQuery({
    queryKey: ['files', currentPath],
    queryFn: () => dropboxClient.listFolder(currentPath),
    onSuccess: (data) => dispatch(setFiles(data))
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => dropboxClient.uploadFile(file, currentPath),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const handleNavigate = (path: string) => {
    dispatch(setCurrentPath(path));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Dropbox Explorer
          </h1>
          
          <ExplorerToolbar
            onFileSelect={handleFileSelect}
            isUploading={uploadMutation.isPending}
            onViewModeChange={(mode) => dispatch(setViewMode(mode))}
            viewMode={viewMode}
          />

          <NavigationBreadcrumb
            currentPath={currentPath}
            onNavigate={handleNavigate}
          />

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
              {viewMode === 'grid' ? (
                <FileGrid files={files || []} onNavigate={handleNavigate} />
              ) : (
                <FileList files={files || []} onNavigate={handleNavigate} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropboxExplorer;