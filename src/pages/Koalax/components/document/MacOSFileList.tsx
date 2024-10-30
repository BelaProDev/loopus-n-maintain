import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { files } from "dropbox";
import { Trash2, Download, Folder } from "lucide-react";

type DropboxFile = files.FileMetadata | files.FolderMetadata | files.DeletedMetadata;

interface MacOSFileListProps {
  files: DropboxFile[] | undefined;
  onDownload: (path: string | undefined, name: string) => void;
  onDelete: (path: string | undefined) => void;
  onNavigate: (path: string) => void;
}

const MacOSFileList = ({ files, onDownload, onDelete, onNavigate }: MacOSFileListProps) => {
  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center px-4 h-10 bg-gray-100 border-b">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
      </div>
      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-gray-50">
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
              const isFolder = file['.tag'] === 'folder';
              
              return (
                <TableRow 
                  key={key} 
                  className={`${isFolder ? 'cursor-pointer' : ''} hover:bg-blue-50 transition-colors`}
                >
                  <TableCell 
                    className="flex items-center gap-2"
                    onClick={() => isFolder && file.path_display && onNavigate(file.path_display)}
                  >
                    {isFolder ? (
                      <Folder className="h-4 w-4 text-blue-500" />
                    ) : (
                      <div className="w-4 h-4 rounded border border-gray-300" />
                    )}
                    <span className={isFolder ? 'text-blue-600 font-medium' : ''}>
                      {file.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {'client_modified' in file && file.client_modified
                      ? format(new Date(file.client_modified), 'PPp')
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {'size' in file ? `${Math.round(file.size / 1024)} KB` : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {!isFolder && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownload(file.path_display, file.name)}
                        className="hover:bg-blue-100"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(file.path_display)}
                      className="hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MacOSFileList;