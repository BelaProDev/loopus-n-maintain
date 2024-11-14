import fallbackDb from '../fallback-db.json';

const defaultWhatsAppSettings = {
  electrics: "",
  plumbing: "",
  ironwork: "",
  woodwork: "",
  architecture: ""
};

export const settingsQueries = {
  getWhatsAppNumbers: () => {
    const whatsappSettings = fallbackDb.settings.find(s => s.key === 'whatsapp_numbers');
    return whatsappSettings?.value || defaultWhatsAppSettings;
  },

  updateWhatsAppNumbers: (numbers: any) => {
    const settings = fallbackDb.settings;
    const whatsappIndex = settings.findIndex(s => s.key === 'whatsapp_numbers');
    if (whatsappIndex >= 0) {
      settings[whatsappIndex].value = numbers;
    } else {
      settings.push({ key: 'whatsapp_numbers', value: numbers });
    }
    return numbers;
  },

  getUsers: () => {
    return fallbackDb.users;
  },

  createUser: (email: string, password: string) => {
    fallbackDb.users.push({ email, password });
    return { email };
  },

  updateUserPassword: (email: string, newPassword: string) => {
    const userIndex = fallbackDb.users.findIndex(u => u.email === email);
    if (userIndex >= 0) {
      fallbackDb.users[userIndex].password = newPassword;
      return true;
    }
    return false;
  }
};