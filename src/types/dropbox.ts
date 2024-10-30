import { files } from 'dropbox';

export type DropboxEntry = files.FileMetadataReference | files.FolderMetadataReference | files.DeletedMetadataReference;

export interface DropboxFile extends files.FileMetadataReference {
  '.tag': 'file';
}

export interface DropboxFolder extends files.FolderMetadataReference {
  '.tag': 'folder';
}

export interface DropboxDeleted extends files.DeletedMetadataReference {
  '.tag': 'deleted';
}