import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText, Upload, FolderPlus, Search, Grid, List, 
  Download, Trash2, Eye, FileImage, FileVideo, FileAudio,
  File, ArrowLeft, MoreVertical, Clock, Star
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

interface DocumentItem {
  id: string;
  name: string;
  type: "folder" | "image" | "video" | "audio" | "document" | "other";
  size?: number;
  modifiedAt: Date;
  starred?: boolean;
}

const getFileIcon = (type: string) => {
  switch (type) {
    case "folder": return FolderPlus;
    case "image": return FileImage;
    case "video": return FileVideo;
    case "audio": return FileAudio;
    case "document": return FileText;
    default: return File;
  }
};

const formatFileSize = (bytes?: number) => {
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  
  // Demo data - in production this would come from Supabase storage
  const [documents] = useState<DocumentItem[]>([
    { id: "1", name: "Project Files", type: "folder", modifiedAt: new Date(), starred: true },
    { id: "2", name: "Images", type: "folder", modifiedAt: new Date() },
    { id: "3", name: "Report Q4 2024.pdf", type: "document", size: 2500000, modifiedAt: new Date(), starred: true },
    { id: "4", name: "Presentation.pptx", type: "document", size: 5200000, modifiedAt: new Date() },
    { id: "5", name: "Team Photo.jpg", type: "image", size: 3100000, modifiedAt: new Date() },
    { id: "6", name: "Product Demo.mp4", type: "video", size: 125000000, modifiedAt: new Date() },
    { id: "7", name: "Podcast Episode.mp3", type: "audio", size: 45000000, modifiedAt: new Date() },
    { id: "8", name: "Budget 2025.xlsx", type: "document", size: 890000, modifiedAt: new Date() },
  ]);

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpload = () => {
    toast.success("File upload dialog would open here");
  };

  const handleNewFolder = () => {
    toast.success("New folder created");
  };

  const storageUsed = 68;

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
            <Link to="/tools">
              <ArrowLeft className="h-5 w-5" />
            </Link>
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
                  <p className="text-2xl font-bold">{documents.length}</p>
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
                  <p className="text-2xl font-bold">{documents.filter(d => d.type === "folder").length}</p>
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
                  <p className="text-2xl font-bold">{documents.filter(d => d.starred).length}</p>
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
                  <span className="font-medium">{storageUsed}%</span>
                </div>
                <Progress value={storageUsed} className="h-2" />
                <p className="text-xs text-muted-foreground">6.8 GB of 10 GB used</p>
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
                <Button onClick={handleUpload} className="flex-1 md:flex-none">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button variant="outline" onClick={handleNewFolder}>
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
              <Button variant="ghost" size="sm" onClick={() => setCurrentPath([])}>
                Home
              </Button>
              {currentPath.map((folder, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-muted-foreground">/</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                  >
                    {folder}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* File Grid/List */}
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
                const Icon = getFileIcon(doc.type);
                return (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="group cursor-pointer hover:shadow-lg transition-all hover:border-primary/50">
                      <CardContent className="p-4 text-center">
                        <div className="relative">
                          <div className={`mx-auto w-16 h-16 rounded-xl flex items-center justify-center mb-3 ${
                            doc.type === "folder" ? "bg-amber-500/20" :
                            doc.type === "image" ? "bg-green-500/20" :
                            doc.type === "video" ? "bg-purple-500/20" :
                            doc.type === "audio" ? "bg-pink-500/20" :
                            "bg-blue-500/20"
                          }`}>
                            <Icon className={`h-8 w-8 ${
                              doc.type === "folder" ? "text-amber-500" :
                              doc.type === "image" ? "text-green-500" :
                              doc.type === "video" ? "text-purple-500" :
                              doc.type === "audio" ? "text-pink-500" :
                              "text-blue-500"
                            }`} />
                          </div>
                          {doc.starred && (
                            <Star className="absolute top-0 right-0 h-4 w-4 text-amber-500 fill-amber-500" />
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 h-6 w-6"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />Preview</DropdownMenuItem>
                              <DropdownMenuItem><Download className="h-4 w-4 mr-2" />Download</DropdownMenuItem>
                              <DropdownMenuItem><Star className="h-4 w-4 mr-2" />Star</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="font-medium text-sm truncate" title={doc.name}>{doc.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatFileSize(doc.size)}
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
                      const Icon = getFileIcon(doc.type);
                      return (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer group"
                        >
                          <div className={`p-2 rounded-lg ${
                            doc.type === "folder" ? "bg-amber-500/20" :
                            doc.type === "image" ? "bg-green-500/20" :
                            doc.type === "video" ? "bg-purple-500/20" :
                            doc.type === "audio" ? "bg-pink-500/20" :
                            "bg-blue-500/20"
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              doc.type === "folder" ? "text-amber-500" :
                              doc.type === "image" ? "text-green-500" :
                              doc.type === "video" ? "text-purple-500" :
                              doc.type === "audio" ? "text-pink-500" :
                              "text-blue-500"
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{doc.name}</p>
                              {doc.starred && <Star className="h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0" />}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {doc.modifiedAt.toLocaleDateString()}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {doc.type}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatFileSize(doc.size)}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
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
      </motion.div>
    </div>
  );
};

export default Documents;