import { DropboxEntry } from '@/types/dropbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { File, Folder } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FileListProps {
  files: DropboxEntry[];
  onNavigate: (path: string) => void;
}

export const FileList = ({ files, onNavigate }: FileListProps) => {
  return (
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
            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
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
  );
};