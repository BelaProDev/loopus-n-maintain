import { Button } from "@/components/ui/button";
import { RefreshCw, LogOut, FolderPlus, Upload } from "lucide-react";

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
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={onCreateInvoiceFolder}>
        <FolderPlus className="w-4 h-4 mr-2" />
        Create Invoices Folder
      </Button>
      
      <Button variant="outline" asChild>
        <label className="cursor-pointer">
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload File'}
          <input
            type="file"
            className="hidden"
            onChange={onFileSelect}
            disabled={isUploading}
          />
        </label>
      </Button>

      <Button variant="outline" onClick={onRefresh}>
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh
      </Button>

      <Button variant="outline" onClick={onLogout}>
        <LogOut className="w-4 h-4 mr-2" />
        Disconnect
      </Button>
    </div>
  );
};

export default DocumentToolbar;