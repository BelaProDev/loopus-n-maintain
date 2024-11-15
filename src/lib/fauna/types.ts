export interface WhatsAppNumbers {
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
