import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FolderPlus, RefreshCw, LogOut } from "lucide-react";

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
    <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-lg">
      <Input
        type="file"
        onChange={onFileSelect}
        className="max-w-[200px]"
        disabled={isUploading}
      />
      <Button onClick={onCreateInvoiceFolder} variant="outline">
        <FolderPlus className="w-4 h-4 mr-2" />
        Create Invoice Folder
      </Button>
      <Button onClick={onRefresh} variant="ghost">
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh
      </Button>
      <Button onClick={onLogout} variant="ghost" className="ml-auto">
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  );
};

export default DocumentToolbar;