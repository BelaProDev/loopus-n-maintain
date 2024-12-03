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

export interface ContactMessage {
  id?: string;
  service: 'electrics' | 'plumbing' | 'ironwork' | 'woodwork' | 'architecture';
  name: string;
  email: string;
  message: string;
  status?: 'new' | 'read' | 'replied';
  createdAt?: string;
}

export interface WhatsAppNumbers {
  id?: string;
  number: string;
  name: string;
}

export interface NavigationLink {
  id?: string;
  text: string;
  url: string;
}

export interface ContentData {
  id?: string;
  type: string;
  content: string;
}

export type ToQueryArg<T> = Omit<T, 'id'>;