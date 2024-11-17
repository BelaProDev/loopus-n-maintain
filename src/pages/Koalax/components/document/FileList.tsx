import { DropboxEntry } from '@/types/dropbox';
import { Download, File, Folder, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FileListProps {
  files: DropboxEntry[];
  onNavigate: (path: string) => void;
  onDownload: (path: string, fileName: string) => void;
  onDelete: (path: string) => void;
}

const FileList = ({ files, onNavigate, onDownload, onDelete }: FileListProps) => {
  if (!files.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No files found in this folder
      </div>
    );
  }

  return (
    <ScrollArea className="h-[60vh]">
      <div className="space-y-1">
        {files.map((file) => (
          <button
            key={file.id}
            onClick={() => file['.tag'] === 'folder' && file.path_display && onNavigate(file.path_display)}
            className="w-full flex items-center gap-2 p-2 hover:bg-accent rounded-lg transition-colors"
          >
            {file['.tag'] === 'folder' ? (
              <Folder className="h-4 w-4 text-blue-500" />
            ) : (
              <File className="h-4 w-4 text-gray-500" />
            )}
            <span className="flex-1 text-left">{file.name}</span>
            
            {file['.tag'] === 'file' && file.path_display && (
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(file.path_display, file.name);
                  }}
                  className="p-1 hover:bg-accent rounded-md transition-colors"
                >
                  <Download className="h-4 w-4 text-blue-500" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(file.path_display);
                  }}
                  className="p-1 hover:bg-accent rounded-md transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            )}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default FileList;