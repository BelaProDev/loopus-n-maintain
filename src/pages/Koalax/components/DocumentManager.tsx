import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Download, Folder, File, ArrowLeft } from "lucide-react";
import * as dropbox from "@/lib/dropbox";

const DocumentManager = () => {
  const [currentPath, setCurrentPath] = useState("");
  const { toast } = useToast();

  const { data: files, isLoading, refetch } = useQuery({
    queryKey: ['dropbox-files', currentPath],
    queryFn: () => dropbox.listFiles(currentPath),
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await dropbox.uploadFile(file, currentPath);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (path: string, filename: string) => {
    try {
      const blob = await dropbox.downloadFile(path);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
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

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const handleBack = () => {
    const newPath = currentPath.split('/').slice(0, -1).join('/');
    setCurrentPath(newPath);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Document Management</h2>
          {currentPath && (
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            type="file"
            onChange={handleFileUpload}
            className="max-w-[200px]"
          />
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground mb-4">
        Current path: /{currentPath || "root"}
      </div>

      <ScrollArea className="h-[400px] rounded-md border">
        {isLoading ? (
          <div className="p-4">Loading...</div>
        ) : (
          <div className="p-4 space-y-2">
            {files?.map((file: any) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-2 hover:bg-accent rounded-md"
              >
                <div 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => file[".tag"] === "folder" && handleNavigate(`${currentPath}/${file.name}`)}
                >
                  {file[".tag"] === "folder" ? (
                    <Folder className="w-4 h-4" />
                  ) : (
                    <File className="w-4 h-4" />
                  )}
                  <span>{file.name}</span>
                </div>
                {file[".tag"] === "file" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(file.path_display, file.name)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default DocumentManager;