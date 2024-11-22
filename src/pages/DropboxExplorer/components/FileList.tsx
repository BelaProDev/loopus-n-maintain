import { useState } from 'react';
import { DropboxEntry } from '@/types/dropbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { File, Folder, Eye, Download, Share2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface FileListProps {
  files: DropboxEntry[];
  onNavigate: (path: string) => void;
  onDrop?: (files: FileList, path: string) => void;
  currentPath: string;
}

export const FileList = ({ files, onNavigate, onDrop, currentPath }: FileListProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<DropboxEntry | null>(null);

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

  const handleShare = (file: DropboxEntry) => {
    // In a real app, this would generate a sharing link
    toast.success("Share link copied to clipboard");
  };

  const handleDownload = (file: DropboxEntry) => {
    // In a real app, this would trigger the file download
    toast.success(`Downloading ${file.name}`);
  };

  const handleDelete = (file: DropboxEntry) => {
    // In a real app, this would delete the file
    toast.success(`Deleted ${file.name}`);
  };

  const getFilePreviewUrl = (file: DropboxEntry) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return `https://api.dropboxapi.com/2/files/get_thumbnail?path=${encodeURIComponent(file.path_display || '')}`;
    }
    return null;
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
            <TableHead>Actions</TableHead>
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
              <TableCell>
                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                  {file['.tag'] === 'file' && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setPreviewFile(file)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(file)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleShare(file)}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(file)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-4xl">
          {previewFile && (
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">{previewFile.name}</h2>
              {getFilePreviewUrl(previewFile) ? (
                <img
                  src={getFilePreviewUrl(previewFile)}
                  alt={previewFile.name}
                  className="max-h-[600px] object-contain mx-auto"
                />
              ) : (
                <div className="flex items-center justify-center h-[400px] bg-muted rounded-lg">
                  <p className="text-muted-foreground">Preview not available</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};