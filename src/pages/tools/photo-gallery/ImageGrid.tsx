import { DropboxFile } from '@/types/dropbox';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ImageGridProps {
  images: DropboxFile[];
  onSelect: (path: string | null) => void;
  selectedImage: string | null;
}

export const ImageGrid = ({ images, onSelect, selectedImage }: ImageGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <Card
          key={image.id}
          className={cn(
            "relative aspect-square cursor-pointer overflow-hidden transition-all hover:scale-105",
            selectedImage === image.path_display && "ring-2 ring-primary"
          )}
          onClick={() => onSelect(image.path_display || null)}
        >
          <img
            src={`https://api.dropboxapi.com/2/files/get_thumbnail`}
            alt={image.name}
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm truncate">
            {image.name}
          </div>
        </Card>
      ))}
    </div>
  );
};