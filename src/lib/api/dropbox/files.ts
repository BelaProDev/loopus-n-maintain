import { Dropbox, files } from 'dropbox';
import { DropboxEntryMetadata } from '@/types/dropboxFiles';

const UPLOAD_SESSION_CHUNK_SIZE = 8 * 1024 * 1024; // 8MB chunks

export class DropboxFileOperations {
  constructor(private client: Dropbox) {}

  async uploadFile(path: string, contents: ArrayBuffer): Promise<DropboxEntryMetadata> {
    if (contents.byteLength <= UPLOAD_SESSION_CHUNK_SIZE) {
      return this.uploadSmallFile(path, contents);
    }
    return this.uploadLargeFile(path, contents);
  }

  private async uploadSmallFile(path: string, contents: ArrayBuffer): Promise<DropboxEntryMetadata> {
    const response = await this.client.filesUpload({
      path,
      contents,
      mode: { '.tag': 'add' },
      autorename: true
    });
    return this.mapFileMetadata(response.result);
  }

  private async uploadLargeFile(path: string, contents: ArrayBuffer): Promise<DropboxEntryMetadata> {
    // Start upload session
    const sessionStart = await this.startUploadSession(contents.slice(0, UPLOAD_SESSION_CHUNK_SIZE));
    let offset = UPLOAD_SESSION_CHUNK_SIZE;

    // Upload chunks
    const cursor: DropboxUploadSessionCursor = {
      session_id: sessionStart.session_id,
      offset
    };

    while (offset < contents.byteLength) {
      const chunk = contents.slice(offset, offset + UPLOAD_SESSION_CHUNK_SIZE);
      const isLastChunk = offset + chunk.byteLength >= contents.byteLength;

      if (isLastChunk) {
        return this.finishUploadSession(cursor, path, chunk);
      } else {
        await this.appendToUploadSession(cursor, chunk);
        offset += chunk.byteLength;
        cursor.offset = offset;
      }
    }

    throw new Error('Upload failed to complete');
  }

  // Core download operations
  async downloadFile(path: string): Promise<Blob> {
    const response = await this.client.filesDownload({ path }) as any;
    return response.result.fileBlob;
  }

  async getTemporaryLink(path: string): Promise<string> {
    const response = await this.client.filesGetTemporaryLink({ path });
    return response.result.link;
  }

  // Core folder operations
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

  // Upload session methods
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

  // Helper methods
  private mapFileMetadata(entry: files.FileMetadataReference | files.FolderMetadataReference): DropboxEntryMetadata {
    const baseMetadata = {
      '.tag': entry['.tag'],
      id: entry.id,
      name: entry.name,
      path_lower: entry.path_lower,
      path_display: entry.path_display
    };

    if (entry['.tag'] === 'file') {
      const fileEntry = entry as files.FileMetadata;
      return {
        ...baseMetadata,
        '.tag': 'file',
        size: fileEntry.size,
        is_downloadable: fileEntry.is_downloadable,
        client_modified: fileEntry.client_modified,
        server_modified: fileEntry.server_modified,
        rev: fileEntry.rev,
        content_hash: fileEntry.content_hash
      };
    } else {
      return {
        ...baseMetadata,
        '.tag': 'folder'
      };
    }
  }
}
