export interface EmailUser {
  email: string;
  password: string;
  type: 'admin' | 'user';
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmailData {
  email: string;
  name: string;
  type: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DropboxTokenData {
  userId: string;
  refreshToken: string;
  lastUpdated: string;
}

export interface FaunaResponse<T> {
  data: T[];
  after?: string;
  before?: string;
}

export interface FaunaDocument<T> {
  ref: {
    id: string;
  };
  ts: number;
  data: T;
}