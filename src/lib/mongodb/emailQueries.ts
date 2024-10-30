import { getMongoClient, handleMongoError } from './client';
import { EmailDocument } from './types';
import { SHA256 } from 'crypto-js';
import fallbackDb from '../fallback-db.json';
import { ObjectId } from 'mongodb';

export const emailQueries = {
  getAllEmails: async () => {
    try {
      const db = await getMongoClient();
      const emails = await db.collection<EmailDocument>('emails').find().toArray();
      return emails.map(email => ({
        ref: { id: email._id?.toString() || '' },
        data: {
          email: email.email,
          name: email.name,
          type: email.type,
          createdAt: email.createdAt,
          updatedAt: email.updatedAt
        }
      }));
    } catch (error) {
      return handleMongoError(error, fallbackDb.emails);
    }
  },

  createEmail: async (data: Omit<EmailDocument, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const db = await getMongoClient();
      const timestamp = Date.now();
      const hashedPassword = data.password ? SHA256(data.password).toString() : undefined;
      
      const result = await db.collection<EmailDocument>('emails').insertOne({
        ...data,
        password: hashedPassword,
        createdAt: timestamp,
        updatedAt: timestamp
      });

      return { ref: { id: result.insertedId.toString() }, data };
    } catch (error) {
      return handleMongoError(error, null);
    }
  },

  updateEmail: async (id: string, data: Partial<EmailDocument>) => {
    try {
      const db = await getMongoClient();
      const updateData = {
        ...data,
        password: data.password ? SHA256(data.password).toString() : undefined,
        updatedAt: Date.now()
      };
      
      await db.collection<EmailDocument>('emails').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      return { ref: { id }, data: updateData };
    } catch (error) {
      return handleMongoError(error, null);
    }
  },

  deleteEmail: async (id: string) => {
    try {
      const db = await getMongoClient();
      await db.collection('emails').deleteOne({ _id: new ObjectId(id) });
      return { success: true };
    } catch (error) {
      return handleMongoError(error, { success: false });
    }
  }
};