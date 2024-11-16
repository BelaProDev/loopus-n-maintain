import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Folder, File } from "lucide-react";
import { DropboxEntry } from "@/types/dropbox";

interface FileListProps {
  files: DropboxEntry[];
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
                  onClick={() => file.path_display && onNavigate(file.path_display)}
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
            <TableCell>
              {file['.tag'] === 'file' ? `${Math.round(file.size / 1024)} KB` : '-'}
            </TableCell>
            <TableCell>
              {file['.tag'] === 'file'
                ? new Date(file.server_modified).toLocaleDateString()
                : '-'}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                {file['.tag'] === 'file' && file.path_display && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDownload(file.path_display!, file.name)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                )}
                {file.path_display && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(file.path_display!)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FileList;