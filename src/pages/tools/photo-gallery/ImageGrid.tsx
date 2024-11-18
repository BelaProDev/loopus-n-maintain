import { DropboxEntry } from '@/types/dropbox';
import { Card } from '@/components/ui/card';
import { Play, Image } from 'lucide-react';
import { getMediaType } from '@/lib/utils/fileUtils';
import { cn } from '@/lib/utils';
import { useDropbox } from '@/contexts/DropboxContext';

interface ImageGridProps {
  images: DropboxEntry[];
  onSelect: (path: string | null) => void;
  selectedImage: string | null;
}

export const ImageGrid = ({ images, onSelect, selectedImage }: ImageGridProps) => {
  const { client } = useDropbox();

  const getThumbnailUrl = async (path: string): Promise<string> => {
    if (!client) return '';
    try {
      const response = await client.filesGetThumbnail({
        path,
        format: { '.tag': 'jpeg' },
        size: { '.tag': 'w640h480' },
        mode: { '.tag': 'strict' }
      });
      return URL.createObjectURL(response.result.fileBlob);
    } catch (error) {
      console.error('Error fetching thumbnail:', error);
      return '';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
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
                <Play className="w-8 md:w-12 h-8 md:h-12 text-white opacity-75 group-hover:opacity-100 transition-opacity" />
              </div>
            ) : (
              <Image className="absolute top-2 right-2 w-4 md:w-6 h-4 md:h-6 text-white opacity-75" />
            )}
            <img
              src={file.path_display ? getThumbnailUrl(file.path_display) : ''}
              alt={file.name}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMSAxNWgtMnYtMmgydjJ6bTAtNGgtMlY3aDJ2NnoiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjwvc3ZnPg==';
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs md:text-sm truncate transform translate-y-full group-hover:translate-y-0 transition-transform">
              {file.name}
            </div>
          </Card>
        );
      })}
    </div>
  );
};