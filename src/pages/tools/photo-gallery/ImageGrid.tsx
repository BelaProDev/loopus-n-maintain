import { DropboxEntry } from '@/types/dropbox';
import { Card } from '@/components/ui/card';
import { Play, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGridProps {
  files: DropboxEntry[];
  onSelect: (path: string) => void;
  selectedImage: string | null;
}

const ImageGrid = ({ files, onSelect, selectedImage }: ImageGridProps) => {
  const mediaType = (fileName: string): 'image' | 'video' | 'other' => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    if (['mp4', 'mov', 'avi', 'webm'].includes(extension)) return 'video';
    return 'other';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {files.map((file) => {
        const type = mediaType(file.name);
        if (type === 'other') return null;

        return (
          <Card
            key={file.path_display}
            className={cn(
              "relative aspect-square overflow-hidden cursor-pointer hover:opacity-90 transition-opacity",
              "group flex items-center justify-center",
              selectedImage === file.path_display && "ring-2 ring-primary"
            )}
            onClick={() => file.path_display && onSelect(file.path_display)}
          >
            {type === 'video' && (
              <Play className="w-12 h-12 text-white absolute z-10" />
            )}
            <ImageIcon className="w-12 h-12 text-gray-400" />
          </Card>
        );
      })}
    </div>
  );
};

export default ImageGrid;