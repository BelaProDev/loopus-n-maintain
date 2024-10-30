import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { files } from "dropbox";

type DropboxFile = files.FileMetadata | files.FolderMetadata | files.DeletedMetadata;

interface FileListProps {
  files: DropboxFile[] | undefined;
  onDownload: (path: string | undefined, name: string) => void;
}

const FileList = ({ files, onDownload }: FileListProps) => {
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
          
          // Use path_lower as a unique key since it's available on all non-deleted file types
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
                  Download
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