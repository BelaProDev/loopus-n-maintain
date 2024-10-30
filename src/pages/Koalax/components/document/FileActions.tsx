import { Button } from "@/components/ui/button";
import { downloadFile } from "@/lib/dropbox";
import { useToast } from "@/components/ui/use-toast";
import { files } from 'dropbox';

type DropboxEntry = files.FileMetadataReference | files.FolderMetadataReference | files.DeletedMetadataReference;

interface FileActionsProps {
  file: DropboxEntry;
  onNavigate: (path: string) => void;
  onDelete: (path: string | undefined) => void;
}

const FileActions = ({ file, onNavigate, onDelete }: FileActionsProps) => {
  const { toast } = useToast();

  const handleDownload = async (path: string | undefined, fileName: string) => {
    if (!path) return;
    try {
      const blob = await downloadFile(path);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      {file['.tag'] === 'folder' ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate(file.path_display || '')}
        >
          Open
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDownload(file.path_display, file.name)}
        >
          Download
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(file.path_display)}
      >
        Delete
      </Button>
    </div>
  );
};

export default FileActions;