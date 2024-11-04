import { Button } from "@/components/ui/button";
import { Folder, File, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface FileListProps {
  files?: Array<{
    '.tag': string;
    name: string;
    path_display?: string;
  }>;
  onDownload: (path: string | undefined, fileName: string) => void;
  onDelete: (path: string | undefined) => void;
  onNavigate: (path: string) => void;
}

const FileList = ({ files = [], onDownload, onDelete, onNavigate }: FileListProps) => {
  const handleDelete = async (path: string | undefined, isFolder: boolean) => {
    if (!path) return;
    
    const itemType = isFolder ? 'folder' : 'file';
    if (confirm(`Are you sure you want to delete this ${itemType}?`)) {
      try {
        await onDelete(path);
        toast.success(`${itemType} deleted successfully`);
      } catch (error) {
        toast.error(`Failed to delete ${itemType}`);
      }
    }
  };

  return (
    <div className="space-y-2">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            {file['.tag'] === 'folder' ? (
              <Folder className="w-5 h-5 text-blue-500" />
            ) : (
              <File className="w-5 h-5 text-gray-500" />
            )}
            <span
              className={file['.tag'] === 'folder' ? 'cursor-pointer hover:text-blue-500' : ''}
              onClick={() => {
                if (file['.tag'] === 'folder' && file.path_display) {
                  onNavigate(file.path_display);
                }
              }}
            >
              {file.name}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownload(file.path_display, file.name)}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(file.path_display, file['.tag'] === 'folder')}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}
      {files.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No files or folders found
        </div>
      )}
    </div>
  );
};

export default FileList;