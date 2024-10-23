export const mockContentData = [
  {
    ref: { id: '1' },
    data: {
      key: 'hero_title',
      type: 'text' as const,
      translations: {
        en: 'Welcome to Our Platform',
        fr: 'Bienvenue sur Notre Plateforme',
        es: 'Bienvenido a Nuestra Plataforma',
        de: 'Willkommen auf Unserer Plattform',
        it: 'Benvenuto sulla Nostra Piattaforma'
      }
    }
  },
  {
    ref: { id: '2' },
    data: {
      key: 'about_description',
      type: 'textarea' as const,
      translations: {
        en: 'Our comprehensive platform helps you manage everything.',
        fr: 'Notre plateforme complète vous aide à tout gérer.',
        es: 'Nuestra plataforma integral te ayuda a gestionar todo.',
        de: 'Unsere umfassende Plattform hilft Ihnen bei der Verwaltung.',
        it: 'La nostra piattaforma completa ti aiuta a gestire tutto.'
      }
    }
  }
];