import { getMongoClient } from './client';
import { ObjectId } from 'mongodb';

export const initializeDatabase = async () => {
  const db = await getMongoClient();
  
  // Create collections if they don't exist
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);
  
  const requiredCollections = ['emails', 'contents', 'clients', 'providers', 'invoices', 'settings'];
  
  for (const collection of requiredCollections) {
    if (!collectionNames.includes(collection)) {
      await db.createCollection(collection);
    }
  }

  // Create indexes
  await db.collection('emails').createIndex({ email: 1 }, { unique: true });
  await db.collection('contents').createIndex({ key: 1, language: 1 }, { unique: true });
  await db.collection('clients').createIndex({ email: 1 }, { unique: true });
  await db.collection('providers').createIndex({ email: 1 }, { unique: true });
  await db.collection('invoices').createIndex({ number: 1 }, { unique: true });

  // Create admin user if it doesn't exist
  const adminExists = await db.collection('emails').findOne({ type: 'admin' });
  if (!adminExists) {
    await db.collection('emails').insertOne({
      _id: new ObjectId(),
      email: 'admin@koalax.com',
      name: 'Admin',
      type: 'admin',
      password: 'miaou00', // This should be hashed in production
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }

  return true;
};