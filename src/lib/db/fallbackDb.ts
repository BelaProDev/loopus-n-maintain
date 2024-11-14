import fallbackDb from '../fallback-db.json';
import { SHA256 } from 'crypto-js';
import { EmailData } from '@/lib/fauna/types';

export const fallbackQueries = {
  getAllEmails: () => {
    return Promise.resolve(fallbackDb.emails);
  },
  
  createEmail: (data: EmailData) => {
    const timestamp = Date.now();
    const hashedPassword = data.password ? SHA256(data.password).toString() : undefined;
    const newEmail = {
      ref: { id: `fallback-${timestamp}` },
      data: {
        email: data.email,
        name: data.name,
        type: data.type,
        password: hashedPassword,
        createdAt: timestamp
      }
    };
    fallbackDb.emails.push(newEmail);
    return Promise.resolve(newEmail);
  },

  updateEmail: (id: string, data: Partial<EmailData>) => {
    const index = fallbackDb.emails.findIndex(email => email.ref.id === id);
    if (index !== -1) {
      fallbackDb.emails[index] = {
        ...fallbackDb.emails[index],
        data: { 
          ...fallbackDb.emails[index].data, 
          ...data 
        }
      };
      return Promise.resolve(fallbackDb.emails[index]);
    }
    return Promise.reject(new Error('Email not found'));
  },

  deleteEmail: (id: string) => {
    const index = fallbackDb.emails.findIndex(email => email.ref.id === id);
    if (index !== -1) {
      fallbackDb.emails.splice(index, 1);
      return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error('Email not found'));
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