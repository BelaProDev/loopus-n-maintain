export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  vatNumber?: string;
}

export interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: 'electrics' | 'plumbing' | 'ironwork' | 'woodwork' | 'architecture';
  availability: boolean;
  rating?: number;
  specialties?: string[];
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  clientId: string;
  providerId: string;
  items: InvoiceItem[];
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  totalAmount: number;
  tax: number;
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}