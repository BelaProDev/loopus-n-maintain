// Import all translations
import * as enCommon from '../../locales/en/common.json';
import * as enServices from '../../locales/en/services.json';
import * as enAdmin from '../../locales/en/admin.json';
import * as enAuth from '../../locales/en/auth.json';
import * as enDocs from '../../locales/en/docs.json';
import * as enUi from '../../locales/en/ui.json';
import * as enApp from '../../locales/en/app.json';
import * as enSettings from '../../locales/en/settings.json';
import * as enTools from '../../locales/en/tools.json';

import * as esCommon from '../../locales/es/common.json';
import * as esServices from '../../locales/es/services.json';
import * as esAdmin from '../../locales/es/admin.json';
import * as esAuth from '../../locales/es/auth.json';
import * as esDocs from '../../locales/es/docs.json';
import * as esUi from '../../locales/es/ui.json';
import * as esApp from '../../locales/es/app.json';
import * as esSettings from '../../locales/es/settings.json';
import * as esTools from '../../locales/es/tools.json';

import * as frCommon from '../../locales/fr/common.json';
import * as frServices from '../../locales/fr/services.json';
import * as frAdmin from '../../locales/fr/admin.json';
import * as frAuth from '../../locales/fr/auth.json';
import * as frDocs from '../../locales/fr/docs.json';
import * as frUi from '../../locales/fr/ui.json';
import * as frApp from '../../locales/fr/app.json';
import * as frSettings from '../../locales/fr/settings.json';
import * as frTools from '../../locales/fr/tools.json';

export const getLanguageResources = () => ({
  en: {
    common: enCommon,
    services: enServices,
    admin: enAdmin,
    auth: enAuth,
    docs: enDocs,
    ui: enUi,
    app: enApp,
    settings: enSettings,
    tools: enTools
  },
  es: {
    common: esCommon,
    services: esServices,
    admin: esAdmin,
    auth: esAuth,
    docs: esDocs,
    ui: esUi,
    app: esApp,
    settings: esSettings,
    tools: esTools
  },
  fr: {
    common: frCommon,
    services: frServices,
    admin: frAdmin,
    auth: frAuth,
    docs: frDocs,
    ui: frUi,
    app: frApp,
    settings: frSettings,
    tools: frTools
  }
});