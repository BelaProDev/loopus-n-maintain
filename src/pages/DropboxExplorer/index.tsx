import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { dropboxClient } from '@/lib/api/dropboxClient';
import { setFiles, setCurrentPath, setViewMode } from '@/store/slices/explorerSlice';
import { FileGrid } from './components/FileGrid';
import { FileList } from './components/FileList';
import { ExplorerToolbar } from './components/ExplorerToolbar';
import { NavigationBreadcrumb } from './components/NavigationBreadcrumb';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, CloudRain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDropboxAuth } from '@/hooks/useDropboxAuth';
import { motion } from 'framer-motion';

const DropboxExplorer = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentPath, viewMode } = useSelector((state: RootState) => state.explorer);
  const { isAuthenticated, login, isLoading: isAuthLoading } = useDropboxAuth();

  const { data: files, isLoading, error } = useQuery({
    queryKey: ['dropbox-files', currentPath],
    queryFn: () => dropboxClient.listFolder(currentPath),
    enabled: isAuthenticated,
    retry: 1,
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to load files. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const path = currentPath === '/' ? `/${file.name}` : `${currentPath}/${file.name}`;
      return dropboxClient.uploadFile(file, path);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropbox-files'] });
      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to upload file. Please try again.',
        variant: 'destructive',
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10">
        <div className="container mx-auto px-8 py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center space-y-12"
          >
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 leading-relaxed">
              Digital Garden Explorer
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed px-6">
              Welcome to your digital sanctuary. Connect with Dropbox to manage your files.
            </p>
            <Button 
              onClick={login}
              disabled={isAuthLoading}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-8 rounded-2xl transform transition-all hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
              <CloudRain className="mr-3 h-6 w-6" />
              {isAuthLoading ? "Connecting..." : "Connect to Dropbox"}
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5 pb-20">
      <div className="container mx-auto px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Digital Garden
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
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
            >
              {viewMode === 'grid' ? (
                <FileGrid files={files || []} onNavigate={handleNavigate} />
              ) : (
                <FileList files={files || []} onNavigate={handleNavigate} />
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DropboxExplorer;