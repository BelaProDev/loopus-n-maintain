import { Dropbox, files } from 'dropbox';
import type { DropboxEntry } from '@/types/dropbox';

export class DropboxFileOperations {
  constructor(private client: Dropbox) {}

  public async uploadFile(path: string, contents: ArrayBuffer): Promise<DropboxEntry> {
    const response = await this.client.filesUpload({
      path,
      contents,
      mode: { '.tag': 'add' },
      autorename: true
    });

    return this.mapFileMetadata(response.result);
  }

  public async downloadFile(path: string): Promise<Blob> {
    const response = await this.client.filesDownload({ path }) as any;
    return response.result.fileBlob;
  }

  public async deleteFile(path: string): Promise<void> {
    await this.client.filesDeleteV2({ path });
  }

  public async createFolder(path: string): Promise<DropboxEntry> {
    const response = await this.client.filesCreateFolderV2({
      path,
      autorename: true
    });
    return this.mapFileMetadata(response.result.metadata);
  }

  public async listFolder(path: string, recursive: boolean = false): Promise<DropboxEntry[]> {
    const response = await this.client.filesListFolder({
      path: path || '',
      recursive,
      include_mounted_folders: true,
      include_non_downloadable_files: true
    });

    return response.result.entries.map(entry => this.mapFileMetadata(entry));
  }

  public mapFileMetadata(entry: files.FileMetadataReference | files.FolderMetadataReference | files.DeletedMetadataReference): DropboxEntry {
    const baseEntry = {
      '.tag': entry['.tag'] as DropboxEntry['.tag'],
      name: entry.name,
      path_lower: entry.path_lower || '',
      path_display: entry.path_display || ''
    };

    if (entry['.tag'] === 'file') {
      const fileEntry = entry as files.FileMetadataReference;
      return {
        ...baseEntry,
        '.tag': 'file' as const,
        size: fileEntry.size || 0,
        is_downloadable: fileEntry.is_downloadable || false,
        client_modified: fileEntry.client_modified || new Date().toISOString(),
        server_modified: fileEntry.server_modified || new Date().toISOString(),
        rev: fileEntry.rev || '',
        content_hash: fileEntry.content_hash
      };
    }

    if (entry['.tag'] === 'folder') {
      return {
        ...baseEntry,
        '.tag': 'folder' as const
      };
    }

    return {
      ...baseEntry,
      '.tag': 'deleted' as const
    };
  }
}