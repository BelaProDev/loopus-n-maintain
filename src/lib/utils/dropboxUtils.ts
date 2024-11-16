import { MediaType } from '@/types/dropbox';

export const sanitizePath = (path: string): string => {
  if (!path || path === '/') return '';
  return path.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');
};

export const getMediaType = (filename: string): MediaType => {
  const extension = getFileExtension(filename).toLowerCase();
  
  const mediaTypes: Record<string, MediaType> = {
    // Images
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    webp: 'image',
    svg: 'image',
    
    // Videos
    mp4: 'video',
    webm: 'video',
    mov: 'video',
    avi: 'video',
    
    // Audio
    mp3: 'audio',
    wav: 'audio',
    ogg: 'audio',
    m4a: 'audio',
    
    // Documents
    pdf: 'document',
    doc: 'document',
    docx: 'document',
    xls: 'document',
    xlsx: 'document',
    ppt: 'document',
    pptx: 'document',
    txt: 'document',
  };

  return mediaTypes[extension] || 'other';
};

export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const sortFiles = (files: any[], sortBy: 'name' | 'date' | 'size' = 'name'): any[] => {
  return [...files].sort((a, b) => {
    // Folders always come first
    if (a.isFolder && !b.isFolder) return -1;
    if (!a.isFolder && b.isFolder) return 1;

    switch (sortBy) {
      case 'date':
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      case 'size':
        return b.size - a.size;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });
};