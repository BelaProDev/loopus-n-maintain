import { DropboxEntry } from '@/types/dropbox';
import { Card } from '@/components/ui/card';
import { Play, Image } from 'lucide-react';
import { getMediaType } from '@/lib/utils/fileUtils';
import { cn } from '@/lib/utils';

interface ImageGridProps {
  images: DropboxEntry[];
  onSelect: (path: string | null) => void;
  selectedImage: string | null;
}

export const ImageGrid = ({ images, onSelect, selectedImage }: ImageGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((file) => {
        if (file['.tag'] !== 'file') return null;
        const mediaType = getMediaType(file.name);
        if (mediaType === 'other') return null;

        return (
          <Card
            key={file.id}
            className={cn(
              "group relative aspect-square cursor-pointer overflow-hidden transition-all hover:scale-105",
              selectedImage === file.path_display && "ring-2 ring-primary"
            )}
            onClick={() => onSelect(file.path_display || null)}
          >
            {mediaType === 'video' ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Play className="w-12 h-12 text-white opacity-75 group-hover:opacity-100 transition-opacity" />
              </div>
            ) : (
              <Image className="absolute top-2 right-2 w-6 h-6 text-white opacity-75" />
            )}
            <img
              src={`https://api.dropboxapi.com/2/files/get_thumbnail`}
              alt={file.name}
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm truncate transform translate-y-full group-hover:translate-y-0 transition-transform">
              {file.name}
            </div>
          </Card>
        );
      })}
    </div>
  );
};