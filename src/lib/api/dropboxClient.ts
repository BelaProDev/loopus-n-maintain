import { DropboxFile, DropboxResponse } from '@/types/dropbox';

const API_BASE = '/.netlify/functions/dropbox';

export const dropboxClient = {
  async listFolder(path: string): Promise<DropboxFile[]> {
    const response = await fetch(`${API_BASE}/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to list folder contents');
    }
    
    const data: DropboxResponse = await response.json();
    return data.entries;
  },

  async uploadFile(file: File, path: string): Promise<DropboxFile> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
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
      headers: {
        'Content-Type': 'application/json',
      },
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete file');
    }
  }
};