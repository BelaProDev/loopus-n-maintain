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
```

3. Run development server:
```bash
npm run dev
```

## License

MIT License