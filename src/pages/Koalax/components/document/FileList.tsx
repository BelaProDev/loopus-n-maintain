import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Folder, File } from "lucide-react";
import { DropboxFile } from "@/types/dropbox";

interface FileListProps {
  files: DropboxFile[] | undefined;
  onDownload: (path: string, fileName: string) => void;
  onDelete: (path: string) => void;
  onNavigate: (path: string) => void;
}

const FileList = ({ files, onDownload, onDelete, onNavigate }: FileListProps) => {
  if (!files) return null;

  return (
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
          <TableRow key={file.id}>
            <TableCell className="flex items-center gap-2">
              {file['.tag'] === 'folder' ? (
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                  onClick={() => onNavigate(file.path_display)}
                >
                  <Folder className="w-4 h-4" />
                  {file.name}
                </Button>
              ) : (
                <span className="flex items-center gap-2">
                  <File className="w-4 h-4" />
                  {file.name}
                </span>
              )}
            </TableCell>
            <TableCell>{file.size ? `${Math.round(file.size / 1024)} KB` : '-'}</TableCell>
            <TableCell>
              {file.server_modified
                ? new Date(file.server_modified).toLocaleDateString()
                : '-'}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                {file['.tag'] === 'file' && (
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
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FileList;