# Loopus & Maintain

A comprehensive building maintenance and professional craft services platform designed for property managers, building owners, and facility maintenance teams.

## Features

- 🏗️ Service Management
  - Streamlined service request system
  - 24/7 Emergency response
  - Five key service areas: Electrical, Plumbing, Ironwork, Woodwork, Architecture

- 📱 Technical Features
  - Server-Side Rendering (SSR)
  - Progressive Web App (PWA)
  - Mobile-first responsive design
  - Offline capabilities
  - Multi-language support

- 🔐 Admin Dashboard (Koalax)
  - Client & Provider Management
  - Invoice Generation (PDF/DOCX export)
  - Document Management with Dropbox integration
  - Content Management System
  - Email Management
  - Password protected admin space

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`:

```env
# MongoDB Configuration
VITE_MONGODB_URI=mongodb+srv://your-connection-string
VITE_MONGODB_DB_NAME=koalax

# Email Configuration
SMTP_HOSTNAME=
SMTP_PORT=
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=
CONTACT_FORM_RECIPIENTS=

# WhatsApp Integration
VITE_WHATSAPP_ELECTRICS=
VITE_WHATSAPP_PLUMBING=
VITE_WHATSAPP_IRONWORK=
VITE_WHATSAPP_WOODWORK=
VITE_WHATSAPP_ARCHITECTURE=

# Admin Access
VITE_ADMIN_KOALAX_MDP=

# Storage & APIs
VITE_FAUNA_SECRET_KEY=
VITE_DROPBOX_ACCESS_TOKEN=
```

4. Development:
   - Start development server: `npm run dev`
   - Build for production: `npm run build`
   - Preview production build: `npm run preview`

For more detailed documentation, visit `/docs` in the application.