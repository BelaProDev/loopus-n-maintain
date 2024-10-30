import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { files } from "dropbox";
import { Trash2, Download } from "lucide-react";

type DropboxFile = files.FileMetadata | files.FolderMetadata | files.DeletedMetadata;

interface FileListProps {
  files: DropboxFile[] | undefined;
  onDownload: (path: string | undefined, name: string) => void;
  onDelete: (path: string | undefined) => void;
}

const FileList = ({ files, onDownload, onDelete }: FileListProps) => {
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
        {files?.map((file) => {
          if (file['.tag'] === 'deleted') return null;
          
          const key = 'path_lower' in file ? file.path_lower : '';
          
          return (
            <TableRow key={key}>
              <TableCell>{file.name}</TableCell>
              <TableCell>
                {'client_modified' in file && file.client_modified
                  ? format(new Date(file.client_modified), 'PPp')
                  : 'N/A'}
              </TableCell>
              <TableCell>
                {'size' in file ? `${Math.round(file.size / 1024)} KB` : 'N/A'}
              </TableCell>
              <TableCell className="text-right space-x-2">
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