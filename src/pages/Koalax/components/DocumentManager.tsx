import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDropboxAuth } from "@/hooks/useDropboxAuth";
import { LogIn, Upload, FolderOpen, Trash2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { uploadFile, listFiles, downloadFile } from "@/lib/dropbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

interface DropboxFile {
  id: string;
  name: string;
  path_display: string;
  size: number;
  client_modified: string;
}

const DocumentManager = () => {
  const { isAuthenticated, login, logout } = useDropboxAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const { data: files, isLoading, refetch } = useQuery({
    queryKey: ['dropbox-files', currentPath],
    queryFn: () => listFiles(currentPath),
    enabled: isAuthenticated
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      await uploadFile(file, currentPath);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropbox-files'] });
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
      setSelectedFile(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    }
  });

  const handleLogin = async () => {
    try {
      await login();
      toast({
        title: "Success",
        description: "Successfully connected to Dropbox",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "Failed to connect to Dropbox",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      uploadMutation.mutate(file);
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const handleCreateInvoiceFolder = async () => {
    try {
      await uploadFile(new File([""], ".keep"), "/invoices");
      toast({
        title: "Success",
        description: "Invoices folder created",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invoices folder",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Document Manager</h2>
        {isAuthenticated ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={logout}>
              Disconnect Dropbox
            </Button>
          </div>
        ) : (
          <Button onClick={handleLogin}>
            <LogIn className="w-4 h-4 mr-2" />
            Connect Dropbox
          </Button>
        )}
      </div>

      {isAuthenticated && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={() => setCurrentPath("/")}>
              <FolderOpen className="w-4 h-4 mr-2" />
              Root
            </Button>
            <Button onClick={() => handleCreateInvoiceFolder()}>
              Create Invoices Folder
            </Button>
            <div className="flex-1" />
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button
              onClick={() => document.getElementById("file-upload")?.click()}
              disabled={uploadMutation.isPending}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploadMutation.isPending ? "Uploading..." : "Upload File"}
            </Button>
          </div>

          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Modified</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files?.map((file: DropboxFile) => (
                  <TableRow key={file.id}>
                    <TableCell>{file.name}</TableCell>
                    <TableCell>
                      {format(new Date(file.client_modified), 'PPp')}
                    </TableCell>
                    <TableCell>
                      {Math.round(file.size / 1024)} KB
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(file.path_display, file.name)}
                      >
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentManager;