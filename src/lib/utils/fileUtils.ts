import { DropboxEntry } from '@/types/dropbox';

export const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'file-pdf';
    case 'doc':
    case 'docx':
      return 'file-text';
    case 'xls':
    case 'xlsx':
      return 'file-spreadsheet';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'image';
    case 'mp4':
    case 'mov':
      return 'video';
    case 'mp3':
    case 'wav':
      return 'audio';
    default:
      return 'file';
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const sortFiles = (files: DropboxEntry[], sortBy: 'name' | 'size' | 'date' = 'name'): DropboxEntry[] => {
  return [...files].sort((a, b) => {
    if (a['.tag'] === 'folder' && b['.tag'] === 'file') return -1;
    if (a['.tag'] === 'file' && b['.tag'] === 'folder') return 1;

    switch (sortBy) {
      case 'size':
        if (a['.tag'] === 'file' && b['.tag'] === 'file') {
          return a.size - b.size;
        }
        return 0;
      case 'date':
        if (a['.tag'] === 'file' && b['.tag'] === 'file') {
          return new Date(b.server_modified).getTime() - new Date(a.server_modified).getTime();
        }
        return 0;
      default:
        return a.name.localeCompare(b.name);
    }
  });
};

export const getMediaType = (fileName: string): 'image' | 'video' | 'audio' | 'document' | 'other' => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  const mediaTypes: Record<string, 'image' | 'video' | 'audio' | 'document'> = {
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
    txt: 'document',
  };

  return mediaTypes[extension] || 'other';
};

export const isImage = (fileName: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? imageExtensions.includes(extension) : false;
};

export const generateThumbnailUrl = (path: string): string => {
  return `https://api.dropboxapi.com/2/files/get_thumbnail?path=${encodeURIComponent(path)}`;
};