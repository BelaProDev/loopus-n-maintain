# CraftCoordination

A comprehensive maintenance and craft services coordination platform built with React, TypeScript, and Vite.

## Overview

CraftCoordination is a Progressive Web App (PWA) that helps coordinate various maintenance services including:
- Electrical work
- Plumbing
- Ironwork
- Woodworking
- Architectural services

## Key Features

- 🏗️ Service-specific request forms
- 📱 PWA with offline support
- 🌐 Multi-language content management
- 📧 Contact form with email notifications
- 🔐 User authentication
- 📊 Admin dashboard (Koalax)

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file with:

```env
# Email Configuration
SMTP_HOSTNAME=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your-username
SMTP_PASSWORD=your-password
SMTP_FROM_EMAIL=noreply@yourdomain.com
CONTACT_FORM_RECIPIENTS=email1@domain.com,email2@domain.com

# WhatsApp Integration (Optional)
VITE_WHATSAPP_ELECTRICS=+1234567890
VITE_WHATSAPP_PLUMBING=+1234567890
VITE_WHATSAPP_IRONWORK=+1234567890
VITE_WHATSAPP_WOODWORK=+1234567890
VITE_WHATSAPP_ARCHITECTURE=+1234567890
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/      # React context providers
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and configurations
├── pages/         # Main route components
└── types/         # TypeScript type definitions
```

## Built With

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- React Query
- Netlify Functions

## License

MIT License - See LICENSE file for details