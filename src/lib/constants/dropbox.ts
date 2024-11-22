export const DROPBOX_CONSTANTS = {
  AUTH: {
    TOKEN_KEY: 'dropbox_tokens',
    EXPIRY_KEY: 'dropbox_token_expiry',
    STATE_KEY: 'dropbox_state',
  },
  FILE_TYPES: {
    IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    VIDEO: ['mp4', 'mov', 'avi', 'webm'],
    AUDIO: ['mp3', 'wav', 'ogg'],
    DOCUMENT: ['pdf', 'doc', 'docx', 'txt']
  },
  QUERY_KEYS: {
    FILES: 'dropbox-files',
    FOLDER: 'dropbox-folder',
    SEARCH: 'dropbox-search'
  },
  CACHE_TIME: 1000 * 60 * 5, // 5 minutes
  STALE_TIME: 1000 * 30 // 30 seconds
};

export const ERROR_MESSAGES = {
  CLIENT_NOT_INITIALIZED: 'Dropbox client not initialized',
  AUTH_FAILED: 'Authentication failed',
  FETCH_FILES_FAILED: 'Failed to fetch files',
  UPLOAD_FAILED: 'Failed to upload file',
  CREATE_FOLDER_FAILED: 'Failed to create folder'
};