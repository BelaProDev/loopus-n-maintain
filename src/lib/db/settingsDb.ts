import fallbackDb from '../fallback-db.json';

export const settingsQueries = {
  getWhatsAppNumbers: () => {
    const whatsappSettings = fallbackDb.settings.find(s => s.key === 'whatsapp_numbers');
    return whatsappSettings?.value || {
      electrics: "",
      plumbing: "",
      ironwork: "",
      woodwork: "",
      architecture: ""
    };
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
  }
};