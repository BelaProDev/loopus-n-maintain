# Loopus & Maintain

A professional building maintenance and craft services platform available at [loopus-n-maintain.netlify.app](https://loopus-n-maintain.netlify.app/)

## Services

Access our specialized services:
- [Electrical Services](https://loopus-n-maintain.netlify.app/electrics)
- [Plumbing Solutions](https://loopus-n-maintain.netlify.app/plumbing)
- [Ironwork Services](https://loopus-n-maintain.netlify.app/ironwork)
- [Woodworking](https://loopus-n-maintain.netlify.app/woodwork)
- [Architectural Planning](https://loopus-n-maintain.netlify.app/architecture)

## Core Features

- 🏗️ Service request management
- 🚨 24/7 Emergency response
- 📱 PWA with offline support
- 📧 Email notifications
- 🔐 Secure authentication
- 📊 Maintenance tracking

## Tech Stack

- React 18 + TypeScript
- Vite
- TailwindCSS + shadcn/ui
- Tanstack Query
- Netlify Functions

## Project Structure

```
src/
├── components/     # UI components & shadcn/ui
├── contexts/      # Auth context
├── data/         # Static content
├── hooks/        # Custom hooks
├── lib/          # Utils & configurations
├── pages/        # Route components
└── types/        # TypeScript definitions
```

## Quick Start

1. Clone and install:
```bash
npm install
```

2. Configure environment:
```env
SMTP_HOSTNAME=
SMTP_USERNAME=
SMTP_PASSWORD=
CONTACT_FORM_RECIPIENTS=
FAUNA_SECRET_KEY=your-admin-secret-key
VITE_FAUNA_PUBLIC_KEY=your-public-key
```

3. Run development server:
```bash
npm run dev
```

## FaunaDB Integration

This project uses FaunaDB for data persistence, integrated with Netlify Functions.

### Setup

1. Create a FaunaDB database at [dashboard.fauna.com](https://dashboard.fauna.com)
2. Get your FaunaDB secret key from the Security tab
3. Add the following environment variables in Netlify:
   ```
   FAUNA_SECRET_KEY=your-admin-secret-key
   VITE_FAUNA_PUBLIC_KEY=your-public-key
   ```

### Database Schema

The database includes the following collections:
- `users`: Stores user information
- `services`: Stores service records

Indexes:
- `users_by_email`: Unique index for user lookup
- `services_by_type`: Index for filtering services

### API Endpoints

Available Netlify Functions:
- `/.netlify/functions/setup-fauna`: Initializes database schema
- `/.netlify/functions/services`: CRUD operations for services
  - GET: Fetch all services
  - POST: Create new service

### Usage Example

```typescript
import { faunaQueries } from '~/lib/fauna';

// Fetch services
const services = await faunaQueries.getAllServices();

// Create service
const newService = await faunaQueries.createService({
  type: 'plumbing',
  description: 'Water leak repair',
});
```

## License

MIT License
