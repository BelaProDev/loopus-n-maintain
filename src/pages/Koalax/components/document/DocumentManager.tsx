import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useDropboxManager } from "@/hooks/useDropboxManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Box, Database, Cloud, Folder, File, ArrowRight, Award } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useDropboxAuth } from "@/hooks/useDropboxAuth";

const DocumentManager = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPath, setCurrentPath] = useState("");
  const { toast } = useToast();
  const { t } = useTranslation(["admin"]);
  const { login } = useDropboxAuth();
  
  const {
    files,
    isLoading,
    isAuthenticated,
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-none shadow-xl rounded-xl">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/20 border-none text-white placeholder-white/60"
                />
                <Button
                  onClick={handleSearch}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Search
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files?.map((file) => (
                <motion.div
                  key={file.path_display}
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
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DocumentManager;