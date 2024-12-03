import { Dropbox, files } from 'dropbox';
import { DropboxEntryMetadata, DropboxUploadSessionCursor, DropboxUploadSessionStartResult } from '@/types/dropboxFiles';

export class DropboxFileOperations {
  constructor(private client: Dropbox) {}

  async uploadFile(path: string, contents: ArrayBuffer): Promise<DropboxEntryMetadata> {
    const response = await this.client.filesUpload({
      path,
      contents,
      mode: { '.tag': 'add' },
      autorename: true
    });
    return this.mapFileMetadata(response.result);
  }

  async downloadFile(path: string): Promise<Blob> {
    const response = await this.client.filesDownload({ path }) as any;
    return response.result.fileBlob;
  }

  async createFolder(path: string): Promise<DropboxEntryMetadata> {
    const response = await this.client.filesCreateFolderV2({
      path,
      autorename: true
    });
    return this.mapFileMetadata(response.result.metadata);
  }

  async deleteFile(path: string): Promise<void> {
    await this.client.filesDeleteV2({ path });
  }

  async listFolder(path: string, recursive: boolean = false): Promise<DropboxEntryMetadata[]> {
    const response = await this.client.filesListFolder({
      path: path || '',
      recursive,
      include_mounted_folders: true,
      include_non_downloadable_files: true
    });
    return response.result.entries.map(entry => this.mapFileMetadata(entry));
  }

  async moveFile(fromPath: string, toPath: string): Promise<DropboxEntryMetadata> {
    const response = await this.client.filesMoveV2({
      from_path: fromPath,
      to_path: toPath,
      autorename: true
    });
    return this.mapFileMetadata(response.result.metadata);
  }

  async copyFile(fromPath: string, toPath: string): Promise<DropboxEntryMetadata> {
    const response = await this.client.filesCopyV2({
      from_path: fromPath,
      to_path: toPath,
      autorename: true
    });
    return this.mapFileMetadata(response.result.metadata);
  }

  async getMetadata(path: string): Promise<DropboxEntryMetadata> {
    const response = await this.client.filesGetMetadata({ path });
    return this.mapFileMetadata(response.result);
  }

  private mapFileMetadata(entry: files.FileMetadataReference | files.FolderMetadataReference): DropboxEntryMetadata {
    const baseMetadata = {
      '.tag': entry['.tag'],
      id: entry.id,
      name: entry.name,
      path_lower: entry.path_lower,
      path_display: entry.path_display
    };

    if (entry['.tag'] === 'file') {
      return {
        ...baseMetadata,
        '.tag': 'file',
        size: entry.size,
        is_downloadable: entry.is_downloadable,
        client_modified: entry.client_modified,
        server_modified: entry.server_modified,
        rev: entry.rev,
        content_hash: entry.content_hash
      };
    } else {
      return {
        ...baseMetadata,
        '.tag': 'folder'
      };
    }
  }

  // Large file upload methods
  async startUploadSession(contents: ArrayBuffer): Promise<DropboxUploadSessionStartResult> {
    const response = await this.client.filesUploadSessionStart({
      contents,
      close: false
    });
    return response.result;
  }

  async appendToUploadSession(
    cursor: DropboxUploadSessionCursor,
    contents: ArrayBuffer,
    close: boolean = false
  ): Promise<void> {
    await this.client.filesUploadSessionAppendV2({
      cursor,
      contents,
      close
    });
  }

  async finishUploadSession(
    cursor: DropboxUploadSessionCursor,
    path: string,
    contents: ArrayBuffer
  ): Promise<DropboxEntryMetadata> {
    const response = await this.client.filesUploadSessionFinish({
      cursor,
      commit: {
        path,
        mode: { '.tag': 'add' },
        autorename: true
      },
      contents
    });
    return this.mapFileMetadata(response.result);
  }
}