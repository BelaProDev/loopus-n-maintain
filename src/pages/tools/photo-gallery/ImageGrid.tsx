import { DropboxEntry } from '@/types/dropbox';
import { Card } from '@/components/ui/card';
import { Play, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDropbox } from '@/contexts/DropboxContext';
import { useState } from 'react';

interface ImageGridProps {
  files: DropboxEntry[];
  onSelect?: (file: DropboxEntry) => void;
}

const ImageGrid = ({ files, onSelect }: ImageGridProps) => {
  const { client } = useDropbox();
  const [thumbnailUrls, setThumbnailUrls] = useState<Record<string, string>>({});

  const getThumbnailUrl = async (path: string) => {
    if (!client) return null;
    
    try {
      const response = await client.filesGetThumbnail({
        path,
        format: { '.tag': 'jpeg' },
        size: { '.tag': 'w640h480' },
        mode: { '.tag': 'strict' }
      });
      
      if (!response.result) return null;
      
      const blob = new Blob([response.result], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      
      setThumbnailUrls(prev => ({ ...prev, [path]: url }));
      return url;
    } catch (error) {
      console.error('Error getting thumbnail:', error);
      return null;
    }
  };

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
              "group flex items-center justify-center"
            )}
            onClick={() => onSelect?.(file)}
          >
            {type === 'video' ? (
              <Play className="w-12 h-12 text-white absolute z-10" />
            ) : null}
            {thumbnailUrls[file.path_display || ''] ? (
              <img
                src={thumbnailUrls[file.path_display || '']}
                alt={file.name}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            ) : (
              <ImageIcon 
                className="w-12 h-12 text-gray-400" 
                onClick={() => getThumbnailUrl(file.path_display || '')} 
              />
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default ImageGrid;