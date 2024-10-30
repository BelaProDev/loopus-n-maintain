import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { files } from 'dropbox';
import { Trash2, Download, Folder } from "lucide-react";

type DropboxEntry = files.FileMetadataReference | files.FolderMetadataReference | files.DeletedMetadataReference;

interface FileListProps {
  files: DropboxEntry[] | undefined;
  onDownload: (path: string | undefined, name: string) => void;
  onDelete: (path: string | undefined) => void;
  onNavigate: (path: string) => void;
}

const FileList = ({ files, onDownload, onDelete, onNavigate }: FileListProps) => {
  return (
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
        {files?.filter(file => file['.tag'] !== 'deleted').map((file) => {
          const key = 'path_lower' in file ? file.path_lower : file.id;
          const isFolder = file['.tag'] === 'folder';
          
          return (
            <TableRow key={key} className={isFolder ? 'cursor-pointer hover:bg-muted/50' : ''}>
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
      </TableBody>
    </Table>
  );
};

export default FileList;