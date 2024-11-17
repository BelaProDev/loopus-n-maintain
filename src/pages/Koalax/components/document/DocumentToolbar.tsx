import { Button } from "@/components/ui/button";
import { Upload, FolderPlus, RefreshCw, LogOut } from "lucide-react";

export interface DocumentToolbarProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  onRefresh: () => void;
  onLogout: () => void;
  currentPath: string;
  onCreateInvoiceFolder: () => Promise<void>;
}

const DocumentToolbar = ({ 
  onFileSelect,
  isUploading,
  onRefresh,
  onLogout,
  onCreateInvoiceFolder
}: DocumentToolbarProps) => {
  return (
    <div className="flex items-center gap-2 p-2">
      <input
        type="file"
        onChange={onFileSelect}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button variant="outline" disabled={isUploading} asChild>
          <span>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </span>
        </Button>
      </label>
      <Button variant="outline" onClick={onCreateInvoiceFolder}>
        <FolderPlus className="h-4 w-4 mr-2" />
        New Folder
      </Button>
      <Button variant="outline" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
      <Button variant="outline" onClick={onLogout} className="ml-auto">
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
};

export default DocumentToolbar;