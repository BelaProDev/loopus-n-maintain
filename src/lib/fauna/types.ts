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