import { ScrollArea } from "@/components/ui/scroll-area";
import { File, Folder } from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified?: string;
}

interface FileListProps {
  files: FileItem[];
  onFileClick: (file: FileItem) => void;
  onFolderClick: (folder: FileItem) => void;
}

const FileList = ({ files, onFileClick, onFolderClick }: FileListProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-1 p-2">
        {files.map((file) => (
          <button
            key={file.id}
            onClick={() => file.type === 'folder' ? onFolderClick(file) : onFileClick(file)}
            className="w-full flex items-center gap-2 p-2 hover:bg-accent rounded-lg transition-colors"
          >
            {file.type === 'folder' ? (
              <Folder className="h-4 w-4" />
            ) : (
              <File className="h-4 w-4" />
            )}
            <span className="flex-1 text-left">{file.name}</span>
            {file.size && <span className="text-sm text-muted-foreground">{file.size} KB</span>}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default FileList;