import { Button } from "@/components/ui/button";
import { FolderOpen, Upload, RefreshCw } from "lucide-react";

interface DocumentToolbarProps {
  onCreateInvoiceFolder: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  onRefresh: () => void;
  onLogout: () => void;
  currentPath: string;
}

const DocumentToolbar = ({
  onCreateInvoiceFolder,
  onFileSelect,
  isUploading,
  onRefresh,
  onLogout,
  currentPath,
}: DocumentToolbarProps) => {
  const isRootDirectory = currentPath === "/";

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={onRefresh} className="w-full sm:w-auto">
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh
      </Button>
      <Button 
        onClick={onCreateInvoiceFolder} 
        disabled={!isRootDirectory}
        title={!isRootDirectory ? "Only available in root directory" : ""}
        className="w-full sm:w-auto"
      >
        <FolderOpen className="w-4 h-4 mr-2" />
        Create Invoices Folder
      </Button>
      <div className="flex-1 hidden sm:block" />
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={onFileSelect}
      />
      <Button
        onClick={() => document.getElementById("file-upload")?.click()}
        disabled={isUploading}
        className="w-full sm:w-auto"
      >
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? "Uploading..." : "Upload File"}
      </Button>
      <Button 
        variant="outline" 
        onClick={onLogout}
        className="w-full sm:w-auto"
      >
        Disconnect Dropbox
      </Button>
    </div>
  );
};

export default DocumentToolbar;