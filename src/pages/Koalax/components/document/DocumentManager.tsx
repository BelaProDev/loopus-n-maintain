import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Box, Cloud, Folder, File, Search, Upload, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useDropboxAuth } from "@/hooks/useDropboxAuth";
import { useDropboxManager } from "@/hooks/useDropboxManager";
import { downloadFile } from "@/lib/dropbox";

const DocumentManager = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPath, setCurrentPath] = useState("");
  const { toast } = useToast();
  const { t } = useTranslation(["admin"]);
  const { login, isAuthenticated } = useDropboxAuth();
  
  const {
    files,
    isLoading,
    uploadMutation,
    deleteMutation,
    createFolderMutation,
    searchMutation,
    moveMutation,
    copyMutation,
    createLinkMutation,
    refetch
  } = useDropboxManager(currentPath);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchMutation.mutate(searchQuery);
    }
  };

  const handleDownload = async (path: string, fileName: string) => {
    try {
      const blob = await downloadFile(path);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "File downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const handleCreateLink = async (path: string) => {
    try {
      await createLinkMutation.mutateAsync(path);
      toast({
        title: "Success",
        description: "Shared link created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create shared link",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Box className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Document Hub</h1>
          </div>
          {!isAuthenticated && (
            <Button
              onClick={login}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transform hover:scale-105 transition-all shadow-lg"
            >
              <Cloud className="w-5 h-5" />
              <span>Connect Dropbox</span>
            </Button>
          )}
        </div>

        {isAuthenticated && (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <Card className="p-6 bg-white/10 backdrop-blur-lg border-none shadow-xl rounded-xl">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Search files..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white/20 border-none text-white placeholder-white/60 pr-10"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSearch}
                      className="bg-blue-500 hover:bg-blue-600 flex-shrink-0"
                    >
                      Search
                    </Button>
                    <Button
                      onClick={() => document.getElementById('file-upload')?.click()}
                      className="bg-green-500 hover:bg-green-600 flex-shrink-0"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Upload
                    </Button>
                    <Button
                      onClick={() => createFolderMutation.mutate(currentPath + '/New Folder')}
                      className="bg-purple-500 hover:bg-purple-600 flex-shrink-0"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      New Folder
                    </Button>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {files?.map((file) => (
                    <motion.div
                      key={file.path_display}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: 1.02 }}
                      className="group"
                    >
                      <Card className="p-4 bg-white/10 backdrop-blur-lg border-none shadow-xl rounded-xl hover:bg-white/20 transition-all">
                        <div className="flex items-start space-x-4">
                          {file['.tag'] === 'folder' ? (
                            <Folder className="w-8 h-8 text-yellow-400" />
                          ) : (
                            <File className="w-8 h-8 text-blue-400" />
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white">{file.name}</h3>
                            <p className="text-sm text-white/60 truncate">
                              {file.path_display}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {file['.tag'] !== 'folder' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownload(file.path_display || '', file.name)}
                              className="text-white hover:text-blue-400"
                            >
                              Download
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCreateLink(file.path_display || '')}
                            className="text-white hover:text-blue-400"
                          >
                            Share
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
};

export default DocumentManager;