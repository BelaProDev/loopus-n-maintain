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

## Architecture

### Server-Side Rendering (SSR)
The application uses Vite's SSR capabilities for:
- Improved initial page load performance
- Better SEO
- Hydration of client-side React components

### Database
- Primary: MongoDB for persistent storage
- Fallback: Local JSON for offline functionality
- Connection pooling and automatic reconnection handling

### PWA Features
- Service Worker for offline capabilities
- Background sync for offline data
- Push notifications support
- Installable on mobile devices

### Security
- Environment variables for sensitive data
- Password-protected admin area
- CORS and XSS protection
- Rate limiting on API routes

## Development Guidelines

### Code Organization
- Components: `src/components/`
- Pages: `src/pages/`
- Database queries: `src/lib/mongodb/`
- Types: `src/types/`
- Utilities: `src/lib/`

### Best Practices
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write unit tests for critical functionality
- Use React Query for data fetching
- Implement error boundaries
- Follow accessibility guidelines

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

3. The application will be available at `http://localhost:3000`

## Monitoring & Maintenance

- MongoDB Atlas dashboard for database monitoring
- Error tracking with console logs
- Regular database backups
- Service worker updates for PWA
- Regular dependency updates

## Support

For issues and feature requests, please create an issue in the repository.

## License

This project is proprietary and confidential. All rights reserved.