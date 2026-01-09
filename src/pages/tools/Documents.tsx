import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText, Upload, FolderPlus, Search, Grid, List, 
  Download, Trash2, Eye, FileImage, FileVideo, FileAudio,
  File, ArrowLeft, MoreVertical, Clock, Star, Loader2
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface DocumentItem {
  id: string;
  name: string;
  file_type: string;
  file_size: number;
  file_path: string | null;
  is_folder: boolean;
  is_starred: boolean;
  parent_folder_id: string | null;
  created_at: string;
  updated_at: string;
}

const getFileIcon = (type: string, isFolder: boolean) => {
  if (isFolder) return FolderPlus;
  switch (type) {
    case "image": return FileImage;
    case "video": return FileVideo;
    case "audio": return FileAudio;
    case "document": return FileText;
    default: return File;
  }
};

const formatFileSize = (bytes: number) => {
  if (!bytes) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const Documents = () => {
  const { t } = useTranslation(["tools", "common"]);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch documents
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['user-documents', currentFolderId],
    queryFn: async () => {
      let query = supabase
        .from('user_documents')
        .select('*')
        .order('is_folder', { ascending: false })
        .order('name', { ascending: true });
      
      if (currentFolderId) {
        query = query.eq('parent_folder_id', currentFolderId);
      } else {
        query = query.is('parent_folder_id', null);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DocumentItem[];
    },
    enabled: !!user,
  });

  // Create folder mutation
  const createFolderMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from('user_documents')
        .insert({
          name,
          file_type: 'folder',
          is_folder: true,
          parent_folder_id: currentFolderId,
          user_id: user?.id,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-documents'] });
      toast.success("Folder created");
      setNewFolderName("");
      setIsCreateFolderOpen(false);
    },
    onError: () => toast.error("Failed to create folder"),
  });

  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-documents'] });
      toast.success("Deleted successfully");
    },
    onError: () => toast.error("Failed to delete"),
  });

  // Toggle star mutation
  const toggleStarMutation = useMutation({
    mutationFn: async ({ id, isStarred }: { id: string; isStarred: boolean }) => {
      const { error } = await supabase
        .from('user_documents')
        .update({ is_starred: !isStarred })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-documents'] });
    },
  });

  // Upload file handler
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    for (const file of Array.from(files)) {
      const fileType = file.type.startsWith('image') ? 'image' :
                       file.type.startsWith('video') ? 'video' :
                       file.type.startsWith('audio') ? 'audio' :
                       file.type.includes('document') || file.type.includes('pdf') ? 'document' : 'other';

      const { error } = await supabase
        .from('user_documents')
        .insert({
          name: file.name,
          file_type: fileType,
          file_size: file.size,
          is_folder: false,
          parent_folder_id: currentFolderId,
          user_id: user.id,
        });

      if (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    queryClient.invalidateQueries({ queryKey: ['user-documents'] });
    toast.success(`${files.length} file(s) added`);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSize = documents.reduce((acc, doc) => acc + (doc.file_size || 0), 0);
  const storageUsed = Math.min((totalSize / (10 * 1024 * 1024 * 1024)) * 100, 100);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/tools"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-3xl font-bold">Document Manager</h1>
        </div>
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-4">
              Please log in to manage your documents.
            </p>
            <Button asChild><Link to="/login">Login</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/tools"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Document Manager</h1>
            <p className="text-muted-foreground">Organize and manage your files</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{documents.filter(d => !d.is_folder).length}</p>
                  <p className="text-sm text-muted-foreground">Total Files</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <FolderPlus className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{documents.filter(d => d.is_folder).length}</p>
                  <p className="text-sm text-muted-foreground">Folders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Star className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{documents.filter(d => d.is_starred).length}</p>
                  <p className="text-sm text-muted-foreground">Starred</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Storage</span>
                  <span className="font-medium">{formatFileSize(totalSize)}</span>
                </div>
                <Progress value={storageUsed} className="h-2" />
                <p className="text-xs text-muted-foreground">of 10 GB used</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex gap-2 flex-1 w-full md:w-auto">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleUpload}
                />
                <Button onClick={() => fileInputRef.current?.click()} className="flex-1 md:flex-none">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button variant="outline" onClick={() => setIsCreateFolderOpen(true)}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Folder
                </Button>
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mt-4 text-sm">
              <Button variant="ghost" size="sm" onClick={() => setCurrentFolderId(null)}>
                Home
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Create Folder Dialog */}
        <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>Enter a name for your new folder.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Folder Name</Label>
                <Input
                  placeholder="My Folder"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>Cancel</Button>
              <Button 
                onClick={() => createFolderMutation.mutate(newFolderName)}
                disabled={!newFolderName.trim() || createFolderMutation.isPending}
              >
                {createFolderMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* File Grid/List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredDocs.length === 0 ? (
          <Card className="py-12">
            <CardContent className="text-center">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No files yet</h3>
              <p className="text-muted-foreground mb-4">Upload files or create folders to get started</p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
              >
                {filteredDocs.map((doc, index) => {
                  const Icon = getFileIcon(doc.file_type, doc.is_folder);
                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card 
                        className="group cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
                        onClick={() => doc.is_folder && setCurrentFolderId(doc.id)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="relative">
                            <div className={`mx-auto w-16 h-16 rounded-xl flex items-center justify-center mb-3 ${
                              doc.is_folder ? "bg-amber-500/20" :
                              doc.file_type === "image" ? "bg-green-500/20" :
                              doc.file_type === "video" ? "bg-purple-500/20" :
                              doc.file_type === "audio" ? "bg-pink-500/20" :
                              "bg-blue-500/20"
                            }`}>
                              <Icon className={`h-8 w-8 ${
                                doc.is_folder ? "text-amber-500" :
                                doc.file_type === "image" ? "text-green-500" :
                                doc.file_type === "video" ? "text-purple-500" :
                                doc.file_type === "audio" ? "text-pink-500" :
                                "text-blue-500"
                              }`} />
                            </div>
                            {doc.is_starred && (
                              <Star className="absolute top-0 right-0 h-4 w-4 text-amber-500 fill-amber-500" />
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 h-6 w-6"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleStarMutation.mutate({ id: doc.id, isStarred: doc.is_starred }); }}>
                                  <Star className="h-4 w-4 mr-2" />{doc.is_starred ? 'Unstar' : 'Star'}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(doc.id); }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <p className="font-medium text-sm truncate" title={doc.name}>{doc.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {doc.is_folder ? 'Folder' : formatFileSize(doc.file_size)}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {filteredDocs.map((doc, index) => {
                        const Icon = getFileIcon(doc.file_type, doc.is_folder);
                        return (
                          <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer group"
                            onClick={() => doc.is_folder && setCurrentFolderId(doc.id)}
                          >
                            <div className={`p-2 rounded-lg ${
                              doc.is_folder ? "bg-amber-500/20" :
                              doc.file_type === "image" ? "bg-green-500/20" :
                              doc.file_type === "video" ? "bg-purple-500/20" :
                              doc.file_type === "audio" ? "bg-pink-500/20" :
                              "bg-blue-500/20"
                            }`}>
                              <Icon className={`h-5 w-5 ${
                                doc.is_folder ? "text-amber-500" :
                                doc.file_type === "image" ? "text-green-500" :
                                doc.file_type === "video" ? "text-purple-500" :
                                doc.file_type === "audio" ? "text-pink-500" :
                                "text-blue-500"
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium truncate">{doc.name}</p>
                                {doc.is_starred && <Star className="h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0" />}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(doc.updated_at).toLocaleDateString()}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {doc.is_folder ? 'folder' : doc.file_type}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {doc.is_folder ? '-' : formatFileSize(doc.file_size)}
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={(e) => { e.stopPropagation(); toggleStarMutation.mutate({ id: doc.id, isStarred: doc.is_starred }); }}
                              >
                                <Star className={`h-4 w-4 ${doc.is_starred ? 'fill-amber-500 text-amber-500' : ''}`} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive"
                                onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(doc.id); }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
};

export default Documents;