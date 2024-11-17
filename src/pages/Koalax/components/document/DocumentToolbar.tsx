import { Button } from "@/components/ui/button";
import { Upload, FolderPlus, Download } from "lucide-react";

interface DocumentToolbarProps {
  onUpload: () => void;
  onCreateFolder: () => void;
  onDownload: () => void;
}

const DocumentToolbar = ({ onUpload, onCreateFolder, onDownload }: DocumentToolbarProps) => {
  return (
    <div className="flex items-center gap-2 p-2">
      <Button variant="outline" onClick={onUpload}>
        <Upload className="h-4 w-4 mr-2" />
        Upload
      </Button>
      <Button variant="outline" onClick={onCreateFolder}>
        <FolderPlus className="h-4 w-4 mr-2" />
        New Folder
      </Button>
      <Button variant="outline" onClick={onDownload}>
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
    </div>
  );
};

export default DocumentToolbar;