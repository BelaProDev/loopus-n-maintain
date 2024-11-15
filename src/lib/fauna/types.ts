import { QueryArgument } from 'fauna';

export interface EmailData {
  email: string;
  name: string;
  type: string;
  password?: string;
}

export interface ContentData {
  key: string;
  type: 'text' | 'textarea' | 'wysiwyg';
  content: string;
  language: string;
  lastModified: number;
  modifiedBy: string;
}

// Helper type to convert our data types to Fauna-compatible query arguments
export type ToQueryArg<T> = {
  [K in keyof T]: T[K];
} & QueryArgument;

export interface ContactMessage {
  id?: string;
  service: 'electrics' | 'plumbing' | 'woodwork' | 'ironwork' | 'architecture';
  name: string;
  email: string;
  message: string;
  createdAt?: string;
  status: 'new' | 'read' | 'archived';
}
