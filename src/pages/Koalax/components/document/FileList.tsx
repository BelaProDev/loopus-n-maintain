import { memo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Trash2, Download, Folder } from "lucide-react";
import { DropboxEntry } from "@/types/dropbox";
import { useVirtualizer } from '@tanstack/react-virtual';

interface FileListProps {
  files: DropboxEntry[] | undefined;
  onDownload: (path: string | undefined, name: string) => void;
  onDelete: (path: string | undefined) => void;
  onNavigate: (path: string) => void;
}

const FileList = ({ files, onDownload, onDelete, onNavigate }: FileListProps) => {
  if (!files || files.length === 0) {
    return <div className="text-center py-8 text-gray-500">No files found</div>;
  }

  const validFiles = files.filter(file => file['.tag'] !== 'deleted');

  const rowVirtualizer = useVirtualizer({
    count: validFiles.length,
    getScrollElement: () => document.querySelector('.virtual-table-container'),
    estimateSize: () => 40,
    overscan: 10,
  });

  return (
    <div className="virtual-table-container" style={{ height: '400px', overflow: 'auto' }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Modified</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const file = validFiles[virtualRow.index];
              const key = 'path_lower' in file ? file.path_lower : file.id;
              const isFolder = file['.tag'] === 'folder';
              
              return (
                <TableRow
                  key={key}
                  className={isFolder ? 'cursor-pointer hover:bg-muted/50' : ''}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <TableCell 
                    className="flex items-center gap-2"
                    onClick={() => isFolder && file.path_display && onNavigate(file.path_display)}
                  >
                    {isFolder && <Folder className="h-4 w-4" />}
                    {file.name}
                  </TableCell>
                  <TableCell>
                    {'client_modified' in file && file.client_modified
                      ? format(new Date(file.client_modified), 'PPp')
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {'size' in file ? `${Math.round(file.size / 1024)} KB` : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {!isFolder && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownload(file.path_display, file.name)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(file.path_display)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </div>
        </TableBody>
      </Table>
    </div>
  );
};

export default memo(FileList);