export interface WhatsAppNumber {
  id: string;
  name: string;
  number: string;
  service: 'electrics' | 'plumbing' | 'ironwork' | 'woodwork' | 'architecture';
}

export type WhatsAppNumbers = WhatsAppNumber[];