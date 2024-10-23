# CraftCoordination

A comprehensive maintenance and craft services coordination platform built with React, TypeScript, and Vite.

## Environment Variables

### Email Configuration
Set up the following environment variables in your Netlify dashboard for the contact form functionality:

```env
SMTP_HOSTNAME=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your-smtp-username
SMTP_PASSWORD=your-smtp-password
SMTP_FROM_EMAIL=noreply@yourdomain.com
CONTACT_FORM_RECIPIENTS=recipient1@domain.com,recipient2@domain.com
```

### Authentication Configuration
Configure these environment variables for the authentication system:

```env
VITE_AUTH_TOKEN_KEY=your-auth-token-key
VITE_AUTH_REFRESH_TOKEN_KEY=your-refresh-token-key
VITE_AUTH_API_URL=your-auth-api-url
```

## Development

This project uses Vite with React and TypeScript. To get started:

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

## Features

- Professional maintenance service coordination
- Specialized sections for different craft services
- Responsive design
- Contact form with email notifications
- User authentication system
- Interactive service request system

## Built With

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- React Query
- Netlify Functions

## License

This project is licensed under the MIT License - see the LICENSE file for details.


---
---
---
---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
