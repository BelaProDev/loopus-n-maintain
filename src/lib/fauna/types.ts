export interface QueryArgument {
  [key: string]: any;
}

export interface EmailData {
  email: string;
  name: string;
  type: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmailUser {
  email: string;
  name: string;
  type: string;
}

export interface ContactMessage {
  id: string;
  service: 'electrics' | 'plumbing' | 'ironwork' | 'woodwork' | 'architecture';
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  createdAt: string;
}

export interface GetTagsResult {
  result: {
    entries?: Array<{
      tags?: Array<{
        tag_text: string;
      }>;
    }>;
  };
}

export interface FaunaResponse<T> {
  data: T | T[];
  after?: string | null;
  before?: string | null;
}