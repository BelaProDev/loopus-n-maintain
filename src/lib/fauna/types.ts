export interface WhatsAppNumbers {
  [key: string]: string;
  electrics: string;
  plumbing: string;
  ironwork: string;
  woodwork: string;
  architecture: string;
}

export interface NavigationLink {
  label: string;
  url: string;
  location: "header" | "footer";
}

export interface EmailUser {
  email: string;
  password: string;
}

export interface EmailData {
  email: string;
  name: string;
  type: string;
  password?: string;
}

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  service: 'electrics' | 'plumbing' | 'ironwork' | 'woodwork' | 'architecture';
  status: 'new' | 'read' | 'archived';
  createdAt: string;
};

export interface ContentData {
  key: string;
  language: string;
  content: string;
}

export type ToQueryArg<T> = {
  [K in keyof T]: T[K];
};