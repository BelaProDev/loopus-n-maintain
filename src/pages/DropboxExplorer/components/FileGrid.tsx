import { DropboxEntry } from '@/types/dropbox';
import { Card } from '@/components/ui/card';
import { File, Folder } from 'lucide-react';

interface FileGridProps {
  files: DropboxEntry[];
  onNavigate: (path: string) => void;
}

export const FileGrid = ({ files, onNavigate }: FileGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {files.map((file) => (
        <Card
          key={file.id}
          className="p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
          onClick={() => file['.tag'] === 'folder' && file.path_display && onNavigate(file.path_display)}
        >
          <div className="flex flex-col items-center space-y-2">
            {file['.tag'] === 'folder' ? (
              <Folder className="w-12 h-12 text-blue-500" />
            ) : (
              <File className="w-12 h-12 text-gray-500" />
            )}
            <p className="text-sm text-center truncate w-full">{file.name}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};