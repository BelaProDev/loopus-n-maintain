import { Button } from "@/components/ui/button";
import { FolderOpen, Upload, RefreshCw } from "lucide-react";

interface DocumentToolbarProps {
  onCreateInvoiceFolder: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  onRefresh: () => void;
  onLogout: () => void;
}

const DocumentToolbar = ({
  onCreateInvoiceFolder,
  onFileSelect,
  isUploading,
  onRefresh,
  onLogout,
}: DocumentToolbarProps) => {
  return (
    <div className="flex gap-4">
      <Button onClick={onRefresh}>
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh
      </Button>
      <Button onClick={onCreateInvoiceFolder}>
        <FolderOpen className="w-4 h-4 mr-2" />
        Create Invoices Folder
      </Button>
      <div className="flex-1" />
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={onFileSelect}
      />
      <Button
        onClick={() => document.getElementById("file-upload")?.click()}
        disabled={isUploading}
      >
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? "Uploading..." : "Upload File"}
      </Button>
      <Button variant="outline" onClick={onLogout}>
        Disconnect Dropbox
      </Button>
    </div>
  );
};

export default DocumentToolbar;