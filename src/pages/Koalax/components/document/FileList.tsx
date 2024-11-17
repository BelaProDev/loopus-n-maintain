import { ScrollArea } from "@/components/ui/scroll-area";
import { File, Folder } from "lucide-react";
import { DropboxEntry } from "@/types/dropbox";

interface FileListProps {
  files: DropboxEntry[];
  onFileClick: (file: DropboxEntry) => void;
  onFolderClick: (folder: DropboxEntry) => void;
}

const FileList = ({ files, onFileClick, onFolderClick }: FileListProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-1 p-2">
        {files.map((file) => (
          <button
            key={file.id}
            onClick={() => file['.tag'] === 'folder' ? onFolderClick(file) : onFileClick(file)}
            className="w-full flex items-center gap-2 p-2 hover:bg-accent rounded-lg transition-colors"
          >
            {file['.tag'] === 'folder' ? (
              <Folder className="h-4 w-4" />
            ) : (
              <File className="h-4 w-4" />
            )}
            <span className="flex-1 text-left">{file.name}</span>
            {file['.tag'] === 'file' && 'size' in file && (
              <span className="text-sm text-muted-foreground">
                {Math.round(file.size / 1024)} KB
              </span>
            )}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default FileList;