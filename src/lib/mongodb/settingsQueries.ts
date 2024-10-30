import { getMongoClient, handleMongoError } from './client';
import { ObjectId } from 'mongodb';

export const settingsQueries = {
  getServiceById: async (serviceId: string) => {
    try {
      const db = await getMongoClient();
      const service = await db.collection('settings').findOne({ 
        type: 'service',
        serviceId 
      });
      return service;
    } catch (error) {
      return handleMongoError(error, null);
    }
  },

  updateWhatsAppNumbers: async (numbers: Record<string, string>) => {
    try {
      const db = await getMongoClient();
      await db.collection('settings').updateOne(
        { type: 'whatsapp_numbers' },
        { $set: { numbers } },
        { upsert: true }
      );
      return numbers;
    } catch (error) {
      return handleMongoError(error, null);
    }
  },

  getWhatsAppNumbers: async () => {
    try {
      const db = await getMongoClient();
      const settings = await db.collection('settings').findOne({ type: 'whatsapp_numbers' });
      return settings?.numbers || {};
    } catch (error) {
      return handleMongoError(error, {});
    }
  }
};