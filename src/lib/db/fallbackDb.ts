import fallbackDb from '../fallback-db.json';
import { SHA256 } from 'crypto-js';

export const fallbackQueries = {
  // Email operations
  getAllEmails: () => fallbackDb.emails,
  
  createEmail: (data: any) => {
    const timestamp = Date.now();
    const hashedPassword = data.password ? SHA256(data.password).toString() : undefined;
    const newEmail = {
      ref: { id: `fallback-${timestamp}` },
      data: {
        ...data,
        password: hashedPassword,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    };
    fallbackDb.emails.push(newEmail);
    return newEmail;
  },

  updateEmail: (id: string, data: any) => {
    const index = fallbackDb.emails.findIndex(email => email.ref.id === id);
    if (index !== -1) {
      fallbackDb.emails[index] = {
        ...fallbackDb.emails[index],
        data: { ...fallbackDb.emails[index].data, ...data, updatedAt: Date.now() }
      };
      return fallbackDb.emails[index];
    }
    throw new Error('Email not found');
  },

  deleteEmail: (id: string) => {
    const index = fallbackDb.emails.findIndex(email => email.ref.id === id);
    if (index !== -1) {
      fallbackDb.emails.splice(index, 1);
      return { success: true };
    }
    throw new Error('Email not found');
  },

  // Content operations
  getAllContent: () => fallbackDb.content,
  
  getContent: (key: string, language: string = 'en') => 
    fallbackDb.content.find(c => c.key === key && c.language === language),

  updateContent: (data: any) => {
    const index = fallbackDb.content.findIndex(
      c => c.key === data.key && c.language === data.language
    );
    if (index !== -1) {
      fallbackDb.content[index] = { ...data };
    } else {
      fallbackDb.content.push(data);
    }
    return data;
  }
};