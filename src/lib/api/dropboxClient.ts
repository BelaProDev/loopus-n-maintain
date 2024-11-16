import { DropboxFile, DropboxResponse } from '@/types/dropbox';

const API_BASE = '/.netlify/functions/dropbox';

const getAuthHeaders = () => {
  const tokens = localStorage.getItem('dropbox_tokens');
  if (!tokens) {
    throw new Error('No authentication tokens found');
  }
  const { access_token } = JSON.parse(tokens);
  return {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  };
};

export const dropboxClient = {
  async listFolder(path: string): Promise<DropboxFile[]> {
    const response = await fetch(`${API_BASE}/list`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ path }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to list folder contents');
    }
    
    const data: DropboxResponse = await response.json();
    return data.entries.map(entry => ({
      ...entry,
      path: entry.path_display || '',
      isFolder: entry['.tag'] === 'folder',
      lastModified: entry.server_modified || new Date().toISOString(),
      size: entry.size || 0,
    }));
  },

  async uploadFile(file: File, path: string): Promise<DropboxFile> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeaders().Authorization
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    return response.json();
  },

  async downloadFile(path: string): Promise<Blob> {
    const response = await fetch(`${API_BASE}/download`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ path }),
    });

    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    return response.blob();
  },

  async deleteFile(path: string): Promise<void> {
    const response = await fetch(`${API_BASE}/delete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ path }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete file');
    }
  }
};