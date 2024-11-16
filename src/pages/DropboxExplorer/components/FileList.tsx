import { useState } from 'react';
import { DropboxEntry } from '@/types/dropbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { File, Folder } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface FileListProps {
  files: DropboxEntry[];
  onNavigate: (path: string) => void;
  onDrop?: (files: FileList, path: string) => void;
  currentPath: string;
}

export const FileList = ({ files, onNavigate, onDrop, currentPath }: FileListProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && onDrop) {
      onDrop(e.dataTransfer.files, currentPath);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative min-h-[300px] rounded-lg transition-colors",
        isDragging && "bg-primary/5 border-2 border-dashed border-primary/50"
      )}
    >
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <p className="text-lg font-medium text-primary">Drop files here to upload</p>
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Modified</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow
              key={file.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => file['.tag'] === 'folder' && file.path_display && onNavigate(file.path_display)}
            >
              <TableCell className="flex items-center space-x-2">
                {file['.tag'] === 'folder' ? (
                  <Folder className="w-4 h-4 text-blue-500" />
                ) : (
                  <File className="w-4 h-4 text-gray-500" />
                )}
                <span>{file.name}</span>
              </TableCell>
              <TableCell>
                {file['.tag'] === 'file' ? `${Math.round(file.size / 1024)} KB` : '-'}
              </TableCell>
              <TableCell>
                {file['.tag'] === 'file'
                  ? formatDistanceToNow(new Date(file.server_modified), { addSuffix: true })
                  : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};