import { DropboxEntry } from '@/types/dropbox';

export const searchFiles = (files: DropboxEntry[], searchTerm: string): DropboxEntry[] => {
  if (!searchTerm) return files;
  
  const normalizedSearch = searchTerm.toLowerCase();
  
  return files.filter(file => {
    const fileName = file.name.toLowerCase();
    return fileName.includes(normalizedSearch);
  });
};

export const filterByType = (files: DropboxEntry[], type: 'images' | 'documents' | 'all'): DropboxEntry[] => {
  if (type === 'all') return files;
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx'];
  
  return files.filter(file => {
    if (file['.tag'] !== 'file') return false;
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension) return false;
    
    switch (type) {
      case 'images':
        return imageExtensions.includes(extension);
      case 'documents':
        return documentExtensions.includes(extension);
      default:
        return true;
    }
  });
};