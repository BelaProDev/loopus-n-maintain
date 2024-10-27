import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to Loopus & Maintain',
      signIn: 'Sign In',
      contact: 'Contact',
      home: 'Home',
      loopusAdmin: 'Loopus Admin',
      docs: 'Docs',
      services: 'Our Services',
      electrics: 'Professional electrical maintenance and repairs',
      plumbing: 'Expert plumbing solutions and maintenance',
      ironwork: 'Structural and decorative ironwork services',
      woodwork: 'Custom woodworking and carpentry services',
      architecture: 'Architectural design, planning and other services',
      learnMore: 'Learn More',
    }
  },
  fr: {
    translation: {
      welcome: 'Bienvenue chez Loopus & Maintain',
      signIn: 'Connexion',
      contact: 'Contact',
      home: 'Accueil',
      loopusAdmin: 'Admin Loopus',
      docs: 'Documentation',
      services: 'Nos Services',
      electrics: 'Maintenance et réparations électriques professionnelles',
      plumbing: 'Solutions de plomberie expertes et maintenance',
      ironwork: 'Services de ferronnerie structurelle et décorative',
      woodwork: 'Services de menuiserie et charpenterie sur mesure',
      architecture: 'Conception architecturale, planification et autres services',
      learnMore: 'En savoir plus',
    }
  },
  nl: {
    translation: {
      welcome: 'Welkom bij Loopus & Maintain',
      signIn: 'Aanmelden',
      contact: 'Contact',
      home: 'Home',
      loopusAdmin: 'Loopus Admin',
      docs: 'Documentatie',
      services: 'Onze Diensten',
      electrics: 'Professioneel elektrisch onderhoud en reparaties',
      plumbing: 'Expert loodgietersoplossingen en onderhoud',
      ironwork: 'Structurele en decoratieve ijzerwerk diensten',
      woodwork: 'Maatwerk houtbewerking en timmerwerk',
      architecture: 'Architecturaal ontwerp, planning en andere diensten',
      learnMore: 'Meer Info',
    }
  },
  es: {
    translation: {
      welcome: 'Bienvenido a Loopus & Maintain',
      signIn: 'Iniciar Sesión',
      contact: 'Contacto',
      home: 'Inicio',
      loopusAdmin: 'Admin Loopus',
      docs: 'Documentación',
      services: 'Nuestros Servicios',
      electrics: 'Mantenimiento y reparaciones eléctricas profesionales',
      plumbing: 'Soluciones expertas de fontanería y mantenimiento',
      ironwork: 'Servicios de herrería estructural y decorativa',
      woodwork: 'Servicios de carpintería y ebanistería a medida',
      architecture: 'Diseño arquitectónico, planificación y otros servicios',
      learnMore: 'Más Información',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;