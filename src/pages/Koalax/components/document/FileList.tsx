import { ScrollArea } from "@/components/ui/scroll-area";
import { File, Folder } from "lucide-react";
import { DropboxEntry } from "@/types/dropbox";

interface FileListProps {
  files: DropboxEntry[];
  onFileClick?: (file: DropboxEntry) => void;
  onFolderClick?: (folder: DropboxEntry) => void;
  onDownload?: (path: string, fileName: string) => Promise<void>;
  onDelete?: (path: string) => void;
  onNavigate: (path: string) => void;
}

const FileList = ({ files, onDownload, onDelete, onNavigate }: FileListProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-1 p-2">
        {files.map((file) => (
          <button
            key={file.id}
            onClick={() => file['.tag'] === 'folder' ? onNavigate(file.path) : undefined}
            className="w-full flex items-center gap-2 p-2 hover:bg-accent rounded-lg transition-colors"
          >
            {file['.tag'] === 'folder' ? (
              <Folder className="h-4 w-4" />
            ) : (
              <File className="h-4 w-4" />
            )}
            <span className="flex-1 text-left">{file.name}</span>
            {file['.tag'] === 'file' && (
              <div className="flex items-center gap-2">
                {onDownload && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownload(file.path, file.name);
                    }}
                    className="text-sm text-blue-500 hover:text-blue-600"
                  >
                    Download
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(file.path);
                    }}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                )}
                {'size' in file && (
                  <span className="text-sm text-muted-foreground">
                    {Math.round(file.size / 1024)} KB
                  </span>
                )}
              </div>
            )}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default FileList;