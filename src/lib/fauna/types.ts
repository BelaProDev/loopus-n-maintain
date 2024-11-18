export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  service: 'electrics' | 'plumbing' | 'ironwork' | 'woodwork' | 'architecture';
  status: 'new' | 'read' | 'archived';
  createdAt: string;
};
