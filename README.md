# Loopus & Maintain

A comprehensive building maintenance and professional craft services platform designed for property managers, building owners, and facility maintenance teams.

## Overview

Loopus & Maintain APP is a Progressive Web App (PWA) specializing in coordinating essential maintenance services across five key areas:
- Electrical work (24/7 emergency service available)
- Professional plumbing solutions
- Custom ironwork and structural repairs
- Expert woodworking and carpentry
- Architectural consultation and planning

## Key Features

- 🏗️ Streamlined service request system
- 🚨 24/7 Emergency response
- 📱 Mobile-friendly PWA with offline capabilities
- 🌐 Multi-language support for diverse clients
- 📧 Instant notification system
- 🔐 Secure client portal
- 📊 Comprehensive maintenance tracking (Koalax)
- 🔄 Fallback database system for offline functionality
- 📄 Advanced document management with Dropbox integration
- 📊 Business management system with client and provider tracking
- 🔄 Export capabilities (PDF, DOCX)
- 📝 Content management system with fallback database

## Business Management Features

### Client Management
- Complete client profile management
- Contact information tracking
- Company details and VAT number handling
- Client history and interaction logging

### Service Provider Management
- Provider profile and specialty tracking
- Availability status monitoring
- Service categorization
- Provider rating system

### Invoice Management
- Invoice creation and editing
- Payment status tracking
- Automated numbering system
- PDF export functionality

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

# WhatsApp Integration
VITE_WHATSAPP_ELECTRICS=+1234567890
VITE_WHATSAPP_PLUMBING=+1234567890
VITE_WHATSAPP_IRONWORK=+1234567890
VITE_WHATSAPP_WOODWORK=+1234567890
VITE_WHATSAPP_ARCHITECTURE=+1234567890

# Database Configuration
VITE_FAUNA_SECRET_KEY=your-fauna-secret-key
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/      # React context providers
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and configurations
│   └── fallback-db.json  # Offline fallback database
├── pages/         # Main route components
│   └── Koalax/   # Admin interface components
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
- FaunaDB with offline fallback