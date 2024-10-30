import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { FileMetadataReference, FolderMetadataReference, DeletedMetadataReference } from "dropbox";

interface FileListProps {
  files: (FileMetadataReference | FolderMetadataReference | DeletedMetadataReference)[] | undefined;
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
          
          return (
            <TableRow key={file.id}>
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